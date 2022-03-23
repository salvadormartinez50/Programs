import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Switch,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Delete, Settings } from "@material-ui/icons";
import { useRouter } from "next/router";
import React from "react";
import AutocompleteCustom from "../../../components/AdminNotaria/AutocompleteCustom";
import TextFieldCustom from "../../../components/AdminNotaria/TextFieldCustom";
import GridContainer from "../../../components/Grid/GridContainer";
import GridItem from "../../../components/Grid/GridItem";
import Layout from "../../../components/Interfaz/Layout";
import { hideLoader, showLoader } from "../../../components/Loader/Loader";
import HandleComparecencias from "../../../components/Operaciones-v3/Admin/Comparecencias/HandleComparecencias";
import EntidadMunicipio from "../../../components/Operaciones-v3/EntidadMunicipio";
import HandleAtributos from "../../../components/Operaciones-v3/Admin/Atributos/HandleAtributos";
import HandleReglas from "../../../components/Operaciones-v3/Admin/Reglas/HandleReglas";
import uuid from "react-uuid";
import HandleObjetos from "../../../components/Operaciones-v3/Admin/Objetos/HandleObjetos";
import HandleDocumentosSoporte from "../../../components/Operaciones-v3/Admin/Documentos/HandleDocumentosSoporte";
import { Alert } from "@material-ui/lab";
import { operacionesV3Service } from "../../../services/operaciones.service";
import NumberFormat from "react-number-format";
import { APIRequest } from "../../../api/APIRequest";
import { urlCalculadora } from "../../../components/Calculadora/Utilerias";
import { camposValidosOperacionesSettings } from "../../../utils/operacionesUtilsV3";
import NumberFieldCustom from "../../../components/AdminNotaria/NumberFieldCustom";
import DatePickerCustom from "../../../components/AdminNotaria/DatePickerCustom";
import { datePickerFormat } from "../../../utils/formateadores";

const useStyles = makeStyles((theme) => ({
  listReglas: {
    backgroundColor: theme.palette.background.default,
  },
  switch: {
    transform: "rotate(180deg) !important",
  },
}));

const ComparecenciaDefault = {
  comparecencia: null,
  cantidadMin: 1,
};

const OperacionMadreDefault = {
  grupo: null,
  nombre: "",
  entidadesFederativas: [],
  municipios: [],
  comparecencias: [],
  objetos: [],
  documentosSoporte: [],
  documentosPrevios: [],
  documentosPostfirma: [],
  honorarios: [],
  gastos: [],
  atributos: [],
  reglas: [],
};

const ObjetoDefault = {
  objeto: null,
  cantidadMin: 1,
};

const DocumentoDefault = {
  tipoDocumento: null,
  requerido: false,
};

const AtributoDefault = {
  atributo: null,
  valorPredeterminado: null,
};

const GastoDefault = {
  concepto: null,
};

const OperacionMadre = () => {
  const router = useRouter();
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(false);
  const [opMadre, setOpMadre] = React.useState(OperacionMadreDefault);
  const [grupos, setGrupos] = React.useState([]);
  const [catComparecencias, setCatComparecencias] = React.useState([]);
  const [catObjetos, setCatObjetos] = React.useState([]);
  const [catDocsSoporte, setCatDocsSoporte] = React.useState([]);
  const [catDocsPrevios, setCatDocsPrevios] = React.useState([]);
  const [catDocsPostfirma, setCatDocsPostfirma] = React.useState([]);
  const [catAtributos, setCatAtributos] = React.useState([]);
  const [catGruposReglas, setCatGruposReglas] = React.useState([]);
  const [catHonorarios, setCatHonorarios] = React.useState([]);
  const [catGastos, setCatGastos] = React.useState([]);

  const breadcrumb = [
    // {
    //   text: "Notaría",
    //   color: "inherit",
    //   href: "/",
    // },
    {
      text: "Gestión de operaciones",
      color: "inherit",
      href: "/operaciones-v3/admin",
    },
    {
      text: "Edición de Operaciones Madre",
      color: "inherit",
      href:
        "/operaciones-v3/admin/operacion-madre" + opMadre?._id
          ? `?id=${opMadre?._id}`
          : "",
    },
  ];
  React.useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading]);

  React.useEffect(async () => {
    setIsLoading(true);

    if (router?.query?.id) {
      const op = await operacionesV3Service.operacionesMadre.detalle(
        router.query.id
      );
      setOpMadre(op?._id ? op : OperacionMadreDefault);
    } else {
      setOpMadre(OperacionMadreDefault);
    }

    await Promise.all([
      getGrupos(),
      getCatComparecenciasSettings(),
      getCatObjetosOperacionSettings(),
      getDocsSoporte(),
      getDocsPrevios(),
      getDocsPostfirma(),
      getAtributos(),
      getGruposReglas(),
      getCatHonorarios(),
      getCatGastos(),
    ]);

    setIsLoading(false);
  }, [router?.query?.id]);

  const getGrupos = async () => {
    const result = await operacionesV3Service.gruposOperaciones.lista();
    setGrupos(result?.length ? result : []);
  };

  const getCatComparecenciasSettings = async () => {
    const result = await operacionesV3Service.catalogos.lista({
      tipo: "CatComparecenciasSettings",
      filterOptions: {
        tipoComparecencia: {
          $nin: ["Dependiente", "Representante", "Cónyuge"],
        },
        activo: true,
      },
      projectionOptions: { _id: 1, nombreComparecencia: 1 },
      sortOptions: { nombreComparecencia: 1 },
    });
    setCatComparecencias(result?.length ? result : []);
  };

  const getCatObjetosOperacionSettings = async () => {
    const result = await operacionesV3Service.catalogos.lista({
      tipo: "CatObjetosOperacionSettings",
      filterOptions: { activo: true },
      sortOptions: { tipoObjeto: 1 },
    });
    setCatObjetos(result?.length ? result : []);
  };

  const getDocsSoporte = async () => {
    const result = await operacionesV3Service.catalogos.lista({
      tipo: "CatDocsSoportes",
      filterOptions: { aplicableA: "Operación", activo: true },
    });
    if (result?.length) {
      setCatDocsSoporte(
        result
          ?.map((a) => a?.subTipoDocumento)
          ?.filter((a, b, c) => c.indexOf(a) == b)
          ?.sort()
      );
    }
  };

  const getDocsPrevios = async () => {
    const result = await operacionesV3Service.catalogos.lista({
      tipo: "DocumentosTramites",
      filterOptions: {
        TipoDocumento: "tramite",
        "PropiedadesDocumento.clasificacion": "previo",
        Status: 1,
      },
      projectionOptions: { _id: 1, hojaNombre: 1 },
      sortOptions: { hojaNombre: 1 },
    });
    setCatDocsPrevios(
      result?.length
        ? result?.map((a) => ({ _id: a._id, nombre: a.hojaNombre }))
        : []
    );
  };

  const getDocsPostfirma = async () => {
    const result = await operacionesV3Service.catalogos.lista({
      tipo: "DocumentosTramites",
      filterOptions: {
        TipoDocumento: "tramite",
        "PropiedadesDocumento.clasificacion": "postfirma",
        Status: 1,
      },
      projectionOptions: { _id: 1, hojaNombre: 1 },
      sortOptions: { hojaNombre: 1 },
    });
    setCatDocsPostfirma(
      result?.length
        ? result?.map((a) => ({ _id: a._id, nombre: a.hojaNombre }))
        : []
    );
  };

  const getAtributos = async () => {
    const atr = await operacionesV3Service.catalogos.lista({
      tipo: "AtributosOperaciones",
      filterOptions: { aplicableA: "Operación", activo: true },
      sortOptions: { aplicableA: 1, nombre: 1 },
    });
    if (atr?.length) setCatAtributos(atr);
  };

  const getGruposReglas = async () => {
    setIsLoading(true);
    const result = await operacionesV3Service.catalogos.lista({
      tipo: "GruposReglas",
      filterOptions: { aplicableA: "Operación", activo: true },
      sortOptions: { nombre: 1 },
    });
    if (result?.length) setCatGruposReglas(result);
    setIsLoading(false);
  };

  const getCatHonorarios = async () => {
    let honorarios = await APIRequest.get(
      urlCalculadora("gastosHonorarios/tipoOperacion/honorarios")
    );
    setCatHonorarios(honorarios?.length ? honorarios : []);
  };

  const getCatGastos = async () => {
    let gastos = await APIRequest.get(
      urlCalculadora("gastosHonorarios/tipoOperacion/gastos")
    );
    setCatGastos(gastos?.length ? gastos : []);
  };

  const agregar = (tipo) => {
    if (
      [
        "comparecencias",
        "objetos",
        "documentosSoporte",
        "documentosPrevios",
        "documentosPostfirma",
        "honorarios",
        "gastos",
        "atributos",
      ].indexOf(tipo) === -1
    )
      return;
    let newList = [];
    if (opMadre[tipo]?.length) newList = [...opMadre[tipo]];
    switch (tipo) {
      case "comparecencias":
        newList = [...newList, { ...ComparecenciaDefault, id: uuid() }];
        break;
      case "objetos":
        newList = [...newList, { ...ObjetoDefault, id: uuid() }];
        break;
      case "documentosSoporte":
        newList = [...newList, { ...DocumentoDefault, id: uuid() }];
        break;
      case "documentosPrevios":
        newList = [...newList, { ...DocumentoDefault, id: uuid() }];
        break;
      case "documentosPostfirma":
        newList = [...newList, { ...DocumentoDefault, id: uuid() }];
        break;
      case "honorarios":
        newList = [...newList, { ...GastoDefault, id: uuid() }];
        break;
      case "gastos":
        newList = [...newList, { ...GastoDefault, id: uuid() }];
        break;
      case "atributos":
        newList = [...newList, { ...AtributoDefault, id: uuid() }];
        break;
    }
    setOpMadre({ ...opMadre, [tipo]: newList });
  };

  const eliminar = (tipo, { id }) => {
    if (
      [
        "comparecencias",
        "objetos",
        "documentosSoporte",
        "documentosPrevios",
        "documentosPostfirma",
        "honorarios",
        "gastos",
        "atributos",
      ].indexOf(tipo) === -1
    )
      return;
    const newList = opMadre[tipo]?.length
      ? opMadre[tipo]?.filter((a) => a?.id !== id)
      : [];
    setOpMadre({ ...opMadre, [tipo]: newList });
  };

  const getReglaIsChecked = (item) => {
    const exist = opMadre?.reglas?.find((a) => a?._id === item?._id);
    return exist ? true : false;
  };

  const checkRegla = (item) => {
    const exist = opMadre?.reglas?.find((a) => a?._id === item?._id);
    let reglas = [];
    if (exist) {
      reglas = opMadre?.reglas?.filter((a) => a?._id !== item?._id);
    } else {
      reglas = [...opMadre?.reglas, item];
    }
    setOpMadre({ ...opMadre, reglas });
  };

  // const camposValidos = async () => {
  //   let msg = "";
  //   if (
  //     !opMadre?.comparecencias?.length ||
  //     opMadre?.comparecencias?.filter((c) => !c?.comparecencia)?.length > 0
  //   ) {
  //     msg = "Favor de agregar y seleccionar al menos una comparecencia";
  //   } else if (
  //     !opMadre?.objetos?.length ||
  //     opMadre?.objetos?.filter((c) => !c?.objeto)?.length > 0
  //   ) {
  //     msg = "Favor de agregar y seleccionar al menos un objeto";
  //   } else if (
  //     !opMadre?.documentosSoporte?.length ||
  //     opMadre?.documentosSoporte?.filter((c) => !c?.tipoDocumento)?.length > 0
  //   ) {
  //     msg = "Favor de agregar y seleccionar al menos un documento soporte";
  //   } else if (
  //     !opMadre?.atributos?.length ||
  //     opMadre?.atributos?.filter((c) => !c?.atributo)?.length > 0
  //   ) {
  //     msg = "Favor de agregar y seleccionar al menos un atributo";
  //   } else if (!opMadre?.reglas?.length) {
  //     msg = "Favor de seleccionar al menos un grupo de reglas";
  //   } else if (!(await grupoConReglas())) {
  //     msg = "Favor de configurar al menos una regla";
  //   }
  //   if (msg) {
  //     ToastWarning(msg);
  //     return false;
  //   }
  //   return true;
  // };

  // const grupoConReglas = async () => {
  //   for (const g of opMadre?.reglas) {
  //     let reglasGrupo = await operacionesV3Service.catalogos.lista({
  //       tipo: "ReglasOperaciones",
  //       filterOptions: { "grupo._id": g._id },
  //       sortOptions: { nombre: 1 },
  //     });
  //     if (reglasGrupo?.length > 0) return true;
  //     return false;
  //   }
  // };

  // const limpiarReglasEliminadas = async (om) => {
  //   let reglas = [];
  //   if (om?.reglas?.length) {
  //     for (const r of om?.reglas) {
  //       let exist = await operacionesV3Service.catalogos.detalle({
  //         tipo: "ReglasOperaciones",
  //         data: { _id: r._id },
  //       });
  //       console.log("EXIST", exist);
  //       if (exist?._id) {
  //         reglas = [...reglas, r];
  //       }
  //     }
  //   }
  //   return { ...om, reglas };
  // };

  const submit = async () => {
    setIsLoading(true);
    if (!(await camposValidosOperacionesSettings(opMadre))) {
      setIsLoading(false);
      return;
    }
    let result;
    if (!opMadre?._id) {
      result = await operacionesV3Service.operacionesMadre.crear(opMadre);
    } else {
      result = await operacionesV3Service.operacionesMadre.actualizar(opMadre);
    }
    if (result?._id) {
      router.push("/operaciones-v3/admin/operacion-madre?id=" + result._id);
      setOpMadre(result);
    }
    setIsLoading(false);
  };

  const DefaultValueComponent = (item, index) => {
    if (!item?.atributo) return null;

    switch (item?.atributo?.tipoDato) {
      case "Texto":
        return (
          <TextFieldCustom
            label="Valor predeterminado"
            value={opMadre?.atributos[index]?.valorPredeterminado}
            onChange={(e) => {
              const atributos = opMadre?.atributos?.map((a, b) =>
                index === b ? { ...a, valorPredeterminado: e.target.value } : a
              );
              setOpMadre({ ...opMadre, atributos });
            }}
          />
        );
      case "Número":
        return (
          <TextFieldCustom
            type="number"
            label="Valor predeterminado"
            value={opMadre?.atributos[index]?.valorPredeterminado}
            onChange={(e) => {
              const atributos = opMadre?.atributos?.map((a, b) =>
                index === b ? { ...a, valorPredeterminado: e.target.value } : a
              );
              setOpMadre({ ...opMadre, atributos });
            }}
          />
        );
      case "Moneda":
        return (
          <NumberFormat
            decimalScale={2}
            fixedDecimalScale={true}
            thousandSeparator={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            placeholder="0.00"
            customInput={TextFieldCustom}
            label="Valor predeterminado"
            value={opMadre?.atributos[index]?.valorPredeterminado}
            onChange={(e) => {
              const atributos = opMadre?.atributos?.map((a, b) =>
                index === b ? { ...a, valorPredeterminado: e.target.value } : a
              );
              setOpMadre({ ...opMadre, atributos });
            }}
          />
        );
      case "Lista":
        return (
          <AutocompleteCustom
            disableClearable={true}
            label="Valor predeterminado"
            options={item?.atributo?.opciones}
            getOptionLabel={(opt) => opt}
            value={opMadre?.atributos[index]?.valorPredeterminado}
            onChange={(e, val) => {
              const atributos = opMadre?.atributos?.map((a, b) =>
                index === b ? { ...a, valorPredeterminado: val } : a
              );
              setOpMadre({ ...opMadre, atributos });
            }}
          />
        );
      case "Binario":
        return (
          <FormControlLabel
            value="top"
            control={
              <Typography
                component="div"
                style={{ marginLeft: "1rem" }}
                // style={{ justifyContent: "flex-end" }}
              >
                <GridContainer
                  component="label"
                  alignItems="center"
                  spacing={1}
                >
                  <GridItem>Si</GridItem>
                  <GridItem>
                    <Switch
                      className={classes.switch}
                      color="primary"
                      checked={opMadre?.atributos[index]?.valorPredeterminado}
                      onChange={(e, val) => {
                        const atributos = opMadre?.atributos?.map((a, b) =>
                          index === b ? { ...a, valorPredeterminado: val } : a
                        );
                        setOpMadre({ ...opMadre, atributos });
                      }}
                      onClick={(event) => event.stopPropagation()}
                      onFocus={(event) => event.stopPropagation()}
                      size="medium"
                      // color="primary"
                    />
                  </GridItem>
                  <GridItem>No</GridItem>
                </GridContainer>
              </Typography>
            }
            label="Valor predeterminado"
            labelPlacement="top"
          />
        );
      case "Fecha":
        return (
          <DatePickerCustom
            label="Valor predeterminado"
            format="DD/MM/YYYY"
            value={opMadre?.atributos[index]?.valorPredeterminado}
            onChange={(e, val) => {
              const atributos = opMadre?.atributos?.map((a, b) =>
                index === b
                  ? {
                      ...a,
                      valorPredeterminado: datePickerFormat(
                        val,
                        "DD/MM/YYYY",
                        "YYYY-MM-DD"
                      ),
                    }
                  : a
              );
              setOpMadre({ ...opMadre, atributos });
            }}
          />
        );
      default:
        return null;
    }
  };

  const MainComponent = () => {
    // if (isLoading) return null;

    if (isLoading && !opMadre?._id) {
      return (
        <GridContainer>
          <GridItem
            xs={12}
            style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
          >
            <Alert severity="info" variant="filled">
              No se encontró la operación madre
            </Alert>
          </GridItem>
        </GridContainer>
      );
    }

    return (
      <>
        <Paper elevation={5} style={{ marginTop: "1.5rem" }}>
          <GridContainer>
            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h5">Operación Madre</Typography>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <AutocompleteCustom
                disableClearable={true}
                label="Grupo de operaciones"
                options={grupos}
                getOptionLabel={(opt) => opt?.nombre}
                value={opMadre?.grupo}
                onChange={(e, val) =>
                  setOpMadre({
                    ...opMadre,
                    grupo: val,
                  })
                }
              />
            </GridItem>

            <GridItem xs={12}>
              <TextFieldCustom
                label="Nombre de la operación madre"
                value={opMadre?.nombre}
                onChange={(e) =>
                  setOpMadre({ ...opMadre, nombre: e.target.value })
                }
              />
            </GridItem>

            <EntidadMunicipio operacion={opMadre} setOperacion={setOpMadre} />

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Comparecencias
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    const el = document.querySelector(
                      "#cat-comparecencias-btn"
                    );
                    if (el) el.click();
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              {opMadre?.comparecencias?.map((item, index) => (
                <GridContainer key={"comparecencia-operacion-" + index}>
                  <GridItem xs={6}>
                    <AutocompleteCustom
                      disableClearable={true}
                      label="Comparecencia"
                      options={catComparecencias}
                      getOptionLabel={(opt) => opt?.nombreComparecencia}
                      value={catComparecencias?.find(
                        (a) => a?._id === item?.comparecencia
                      )}
                      onChange={(e, val) => {
                        const comparecencias = opMadre?.comparecencias?.map(
                          (a, b) => {
                            if (index === b) {
                              return {
                                ...a,
                                comparecencia: val?._id || null,
                              };
                            }
                            return a;
                          }
                        );
                        setOpMadre({ ...opMadre, comparecencias });
                      }}
                      onOpen={() => getCatComparecenciasSettings()}
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <NumberFieldCustom
                      label="Cantidad mínima"
                      value={item?.cantidadMin}
                      onChange={(e) => {
                        const comparecencias = opMadre?.comparecencias?.map(
                          (a, b) => {
                            if (index === b) {
                              return {
                                ...a,
                                cantidadMin: e.target.value,
                              };
                            }
                            return a;
                          }
                        );
                        setOpMadre({ ...opMadre, comparecencias });
                      }}
                      min={1}
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <Tooltip title="Eliminar comparecencia">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => eliminar("comparecencias", item)}
                        style={{ marginTop: "1rem" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </GridContainer>
              ))}
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => agregar("comparecencias")}
              >
                Agregar comparecencia
              </Button>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Objetos
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    const el = document.querySelector(
                      "#handle-objetos-operacion-settings-btn"
                    );
                    if (el) el.click();
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              {opMadre?.objetos?.map((item, index) => (
                <GridContainer key={"objeto-operacion-" + index}>
                  <GridItem xs={6}>
                    <AutocompleteCustom
                      disableClearable={true}
                      label="Objeto"
                      options={catObjetos}
                      getOptionLabel={(opt) => opt?.nombre}
                      value={catObjetos?.find((a) => a?._id === item?.objeto)}
                      onChange={(e, val) => {
                        const objetos = opMadre?.objetos?.map((a, b) => {
                          if (index === b) {
                            return {
                              ...a,
                              objeto: val?._id || null,
                            };
                          }
                          return a;
                        });
                        setOpMadre({ ...opMadre, objetos });
                      }}
                      onOpen={() => getCatObjetosOperacionSettings()}
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <NumberFieldCustom
                      label="Cantidad mínima"
                      value={item?.cantidadMin}
                      onChange={(e) => {
                        const objetos = opMadre?.objetos?.map((a, b) => {
                          if (index === b) {
                            return {
                              ...a,
                              cantidadMin: e.target.value,
                            };
                          }
                          return a;
                        });
                        setOpMadre({ ...opMadre, objetos });
                      }}
                      min={1}
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <Tooltip title="Eliminar objeto">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => eliminar("objetos", item)}
                        style={{ marginTop: "1rem" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </GridContainer>
              ))}
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => agregar("objetos")}
              >
                Agregar objeto
              </Button>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Documentos soporte
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    const el = document.querySelector(
                      "#handle-cat-documentos-soporte-btn"
                    );
                    if (el) el.click();
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              {opMadre?.documentosSoporte?.map((item, index) => (
                <GridContainer key={"doc-soporte-operacion-" + index}>
                  <GridItem xs={6}>
                    <AutocompleteCustom
                      disableClearable={true}
                      label="Tipo de documento"
                      options={catDocsSoporte}
                      getOptionLabel={(opt) => opt}
                      //   getOptionSelected={(opt, val) => opt?._id === val?._id}
                      value={item?.tipoDocumento}
                      onChange={(e, val) => {
                        const documentosSoporte =
                          opMadre?.documentosSoporte?.map((a, b) => {
                            if (index === b) {
                              return {
                                ...a,
                                tipoDocumento: val,
                              };
                            }
                            return a;
                          });
                        setOpMadre({ ...opMadre, documentosSoporte });
                      }}
                      onOpen={() => getDocsSoporte()}
                    />
                  </GridItem>

                  <GridItem xs={3} align="center">
                    <FormControlLabel
                      value="top"
                      control={
                        <Typography
                          component="div"
                          style={{ marginLeft: "1rem" }}
                          // style={{ justifyContent: "flex-end" }}
                        >
                          <GridContainer
                            component="label"
                            alignItems="center"
                            spacing={1}
                          >
                            <GridItem>Si</GridItem>
                            <GridItem>
                              <Switch
                                className={classes.switch}
                                color="primary"
                                checked={item?.requerido}
                                onChange={(e, val) => {
                                  const documentosSoporte =
                                    opMadre?.documentosSoporte?.map((a, b) => {
                                      if (index === b) {
                                        return {
                                          ...a,
                                          requerido: val,
                                        };
                                      }
                                      return a;
                                    });
                                  setOpMadre({ ...opMadre, documentosSoporte });
                                }}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                                size="medium"
                                // color="primary"
                              />
                            </GridItem>
                            <GridItem>No</GridItem>
                          </GridContainer>
                        </Typography>
                      }
                      label="Obligatorio"
                      labelPlacement="top"
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <Tooltip title="Eliminar documento">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => eliminar("documentosSoporte", item)}
                        style={{ marginTop: "1rem" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </GridContainer>
              ))}
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => agregar("documentosSoporte")}
              >
                Agregar documento
              </Button>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Documentos previos
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    window.open("/documentos/outAdminTramites", "_ blank");
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              {opMadre?.documentosPrevios?.map((item, index) => (
                <GridContainer key={"doc-previos-operacion-" + index}>
                  <GridItem xs={6}>
                    <AutocompleteCustom
                      disableClearable={true}
                      label="Tipo de documento"
                      options={catDocsPrevios}
                      getOptionLabel={(opt) => opt?.nombre}
                      value={item?.tipoDocumento}
                      onChange={(e, val) => {
                        const documentosPrevios =
                          opMadre?.documentosPrevios?.map((a, b) => {
                            if (index === b) {
                              return {
                                ...a,
                                tipoDocumento: val || null,
                              };
                            }
                            return a;
                          });
                        setOpMadre({ ...opMadre, documentosPrevios });
                      }}
                      onOpen={() => getDocsPrevios()}
                    />
                  </GridItem>

                  <GridItem xs={3} align="center">
                    <FormControlLabel
                      value="top"
                      control={
                        <Typography
                          component="div"
                          style={{ marginLeft: "1rem" }}
                          // style={{ justifyContent: "flex-end" }}
                        >
                          <GridContainer
                            component="label"
                            alignItems="center"
                            spacing={1}
                          >
                            <GridItem>Si</GridItem>
                            <GridItem>
                              <Switch
                                className={classes.switch}
                                color="primary"
                                checked={item?.requerido}
                                onChange={(e, val) => {
                                  const documentosPrevios =
                                    opMadre?.documentosPrevios?.map((a, b) => {
                                      if (index === b) {
                                        return {
                                          ...a,
                                          requerido: val,
                                        };
                                      }
                                      return a;
                                    });
                                  setOpMadre({ ...opMadre, documentosPrevios });
                                }}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                                size="medium"
                                // color="primary"
                              />
                            </GridItem>
                            <GridItem>No</GridItem>
                          </GridContainer>
                        </Typography>
                      }
                      label="Obligatorio"
                      labelPlacement="top"
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <Tooltip title="Eliminar documento">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => eliminar("documentosPrevios", item)}
                        style={{ marginTop: "1rem" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </GridContainer>
              ))}
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => agregar("documentosPrevios")}
              >
                Agregar documento
              </Button>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Documentos posfirma
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    window.open("/documentos/outAdminTramites", "_ blank");
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              {opMadre?.documentosPostfirma?.map((item, index) => (
                <GridContainer key={"doc-postfirma-operacion-" + index}>
                  <GridItem xs={6}>
                    <AutocompleteCustom
                      disableClearable={true}
                      label="Tipo de documento"
                      options={catDocsPostfirma}
                      getOptionLabel={(opt) => opt?.nombre}
                      value={item?.tipoDocumento}
                      onChange={(e, val) => {
                        const documentosPostfirma =
                          opMadre?.documentosPostfirma?.map((a, b) => {
                            if (index === b) {
                              return {
                                ...a,
                                tipoDocumento: val || null,
                              };
                            }
                            return a;
                          });
                        setOpMadre({ ...opMadre, documentosPostfirma });
                      }}
                      onOpen={() => getDocsPostfirma()}
                    />
                  </GridItem>

                  <GridItem xs={3} align="center">
                    <FormControlLabel
                      value="top"
                      control={
                        <Typography
                          component="div"
                          style={{ marginLeft: "1rem" }}
                          // style={{ justifyContent: "flex-end" }}
                        >
                          <GridContainer
                            component="label"
                            alignItems="center"
                            spacing={1}
                          >
                            <GridItem>Si</GridItem>
                            <GridItem>
                              <Switch
                                className={classes.switch}
                                color="primary"
                                checked={item?.requerido}
                                onChange={(e, val) => {
                                  const documentosPostfirma =
                                    opMadre?.documentosPostfirma?.map(
                                      (a, b) => {
                                        if (index === b) {
                                          return {
                                            ...a,
                                            requerido: val,
                                          };
                                        }
                                        return a;
                                      }
                                    );
                                  setOpMadre({
                                    ...opMadre,
                                    documentosPostfirma,
                                  });
                                }}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                                size="medium"
                                // color="primary"
                              />
                            </GridItem>
                            <GridItem>No</GridItem>
                          </GridContainer>
                        </Typography>
                      }
                      label="Obligatorio"
                      labelPlacement="top"
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <Tooltip title="Eliminar documento">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => eliminar("documentosPostfirma", item)}
                        style={{ marginTop: "1rem" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </GridContainer>
              ))}
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => agregar("documentosPostfirma")}
              >
                Agregar documento
              </Button>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Honorarios
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    window.open("/calculadora/gastosHonorarios", "_ blank");
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              {opMadre?.honorarios?.map((item, index) => (
                <GridContainer key={"honorarios-operacion-" + index}>
                  <GridItem xs={6}>
                    <AutocompleteCustom
                      disableClearable={true}
                      label="Concepto"
                      options={catHonorarios}
                      getOptionLabel={(opt) => opt?.nombre}
                      value={item?.concepto}
                      onChange={(e, val) => {
                        const honorarios = opMadre?.honorarios?.map((a, b) => {
                          if (index === b) {
                            return {
                              ...a,
                              concepto: val || null,
                            };
                          }
                          return a;
                        });
                        setOpMadre({ ...opMadre, honorarios });
                      }}
                      onOpen={() => getCatHonorarios()}
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <Tooltip title="Eliminar honorario">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => eliminar("honorarios", item)}
                        style={{ marginTop: "1rem" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </GridContainer>
              ))}
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => agregar("honorarios")}
              >
                Agregar honorario
              </Button>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Gastos
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    window.open("/calculadora/gastosHonorarios", "_ blank");
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              {opMadre?.gastos?.map((item, index) => (
                <GridContainer key={"gastos-operacion-" + index}>
                  <GridItem xs={6}>
                    <AutocompleteCustom
                      disableClearable={true}
                      label="Concepto"
                      options={catGastos}
                      getOptionLabel={(opt) => opt?.nombre}
                      value={item?.concepto}
                      onChange={(e, val) => {
                        const gastos = opMadre?.gastos?.map((a, b) => {
                          if (index === b) {
                            return {
                              ...a,
                              concepto: val || null,
                            };
                          }
                          return a;
                        });
                        setOpMadre({ ...opMadre, gastos });
                      }}
                      onOpen={() => getCatGastos()}
                    />
                  </GridItem>

                  <GridItem xs={3}>
                    <Tooltip title="Eliminar gasto">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => eliminar("gastos", item)}
                        style={{ marginTop: "1rem" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </GridContainer>
              ))}
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => agregar("gastos")}
              >
                Agregar gasto
              </Button>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Atributos
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    const el = document.querySelector("#handle-atributos-btn");
                    if (el) el.click();
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              {opMadre?.atributos?.map((item, index) => (
                <GridContainer key={"atributo-operacion-" + index}>
                  <GridItem xs={6}>
                    <AutocompleteCustom
                      disableClearable={true}
                      label="Nombre del atributo"
                      options={catAtributos}
                      getOptionLabel={(opt) => opt?.nombre}
                      value={item?.atributo}
                      onChange={(e, val) => {
                        const atributos = opMadre?.atributos?.map((a, b) => {
                          if (index === b) {
                            return {
                              ...a,
                              atributo: val,
                            };
                          }
                          return a;
                        });
                        setOpMadre({ ...opMadre, atributos });
                      }}
                      onOpen={() => getAtributos()}
                    />
                  </GridItem>

                  <GridItem xs={3} align="center">
                    {DefaultValueComponent(item, index)}
                  </GridItem>

                  <GridItem xs={3}>
                    <Tooltip title="Eliminar atributo">
                      <IconButton
                        type="button"
                        color="primary"
                        onClick={() => eliminar("atributos", item)}
                        style={{ marginTop: "1rem" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </GridContainer>
              ))}
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={() => agregar("atributos")}
              >
                Agregar atributo
              </Button>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

            <GridItem xs={12}>
              <Typography variant="h6">
                Reglas de negocio
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => {
                    const el = document.querySelector("#handle-reglas-btn");
                    if (el) el.click();
                  }}
                >
                  <Settings fontSize="large" />
                </IconButton>
              </Typography>
            </GridItem>

            <GridItem xs={12}>
              <List className={classes.listReglas}>
                {catGruposReglas?.map((item, index) => {
                  return (
                    <ListItem
                      button
                      key={`item-regla-${index}`}
                      onClick={() => checkRegla(item)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={getReglaIsChecked(item)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={item?.nombre} />
                    </ListItem>
                  );
                })}
                {!catGruposReglas?.length ? (
                  <Typography>
                    No hay reglas dadas de alta en el sistema
                  </Typography>
                ) : null}
              </List>
            </GridItem>

            <GridItem xs={12} style={{ marginTop: "1.5rem" }} />
          </GridContainer>
        </Paper>

        <GridContainer>
          <GridItem
            xs={12}
            style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
            align="center"
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => submit()}
            >
              Guardar
            </Button>
          </GridItem>
        </GridContainer>
      </>
    );
  };

  return (
    <Layout title="Alta de operaciones" breadcrumb={breadcrumb}>
      <button
        id="refresh-comparecencias-btn"
        type="button"
        hidden
        onClick={() => getCatComparecenciasSettings()}
      />

      <button
        id="refresh-cat-reglas-btn"
        type="button"
        hidden
        onClick={() => getGruposReglas()}
      />

      <GridContainer>
        <GridItem xs={12}>{MainComponent()}</GridItem>
      </GridContainer>

      <HandleComparecencias />
      <HandleObjetos />
      <HandleDocumentosSoporte />
      <HandleAtributos />
      <HandleReglas />
    </Layout>
  );
};

export default OperacionMadre;
