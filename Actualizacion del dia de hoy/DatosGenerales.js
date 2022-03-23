import { Button, makeStyles, Paper, Typography, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import GridContainer from "../../Grid/GridContainer";
import GridItem from "../../Grid/GridItem";
import { APIRequest } from "../../../api/APIRequest";
import AutocompleteControlled from "../../Form/AutocompleteControlled";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { getStorageItem, setStorageItem } from "../../../utils/localStorage";
import TextFieldControlled from "../../Form/TextFieldControlled";
import TextAreaControlled from "../../Form/TextAreaControlled";
import DatePickerControlled from "../../Form/DatePickerControlled";
import { getCatalogo } from "../../../api/catalogosAPI";
import moment from "moment";
import { calculaCURP, calculaRFC } from "../../../utils/calculaCurpRfc";
import { ToastInfo, ToastWarning } from "../../Toast/Toast";
import { datePickerFormat } from "../../../utils/formateadores";
import NumberFieldControlled from "../../Form/NumberFieldControlled";
import DatosDomicilio from "../DatosDomicilio";
import Identificaciones from "../Identificaciones/Identificaciones";
import EstadoCivil from "./EstadoCivil";
import CarruselDocumentos from "../Documentos/CarruselDocumentos";
import AutocompleteMultiChipControlled from "../../Form/AutocompleteMultiChipControlled";
import { eliminarDocumento } from "../../../api/personasAPI";
import AlertDialog from "../../common/AlertDialog";
import { Alert } from "@material-ui/lab";
import { CloudUpload } from "@material-ui/icons";
import { hideLoader, showLoader } from "../../Loader/Loader";
import {
  filtrarDocumentosCargados,
  filtrarDocumentosNoCargados,
} from "../../../utils/objetos.utils";
import { useRouter } from "next/router";
import TextFieldControlledV2 from "../../Form/TextFieldControlledV2";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "77.5vh",
    overflowY: "auto",
  },
  fabActionsRight: {
    position: "fixed",
    bottom: theme.spacing(1),
    right: theme.spacing(0),
  },
  paper: {
    background: "#ffffff",
    border: "0.2px solid " + theme.palette.primary.main,
    boxSizing: "border-box",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "16px",
    marginBottom: "16px",
    width: "100%",
  },
}));

const personaFisicaDefault = {
  idPersonaFisica: null,
  ocupacion: null,
  nombre: null,
  primerApellido: null,
  segundoApellido: null,
  alias: null,
  curp: "",
  rfc: "",
  identificaciones: [],
  otraClaveIdentidad: null,
  nacionalidad: null,
};

/**
 * Componente para manejar la sección de Datos Generales
 * @param {Function} clickCancelar
 */
export default function DatosGenerales({ clickCancelar, esConyuge }) {
  const classes = useStyles();
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors }, setValue, getValues } = useForm({ mode: "onChange" });

  const [catalogoOcupaciones, setCatalogoOcupaciones] = useState([]);
  const [
    catalogoEntidadFederativaNacimiento,
    setCatalogoEntidadFederativaNacimiento,
  ] = useState([]);
  const [catalogoPaisNacimiento, setCatalogoPaisNacimiento] = useState([]);
  const [catalogoGeneros, setCatalogoGeneros] = useState([]);
  const [catalogoMunicipioNacimiento, setCatalogoMunicipioNacimiento] =
    useState([]);
  const [catalogoNacionalidades, setCatalogoNacionalidades] = useState([]);
  const [catGrupoCorporativo, setCatGrupoCorporativo] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [idPersonaFisica, setIdPersonaFisica] = useState(null);
  const [ocupacion, setOcupacion] = useState(null);
  const [nombreState, setNombre] = useState(null);
  const [primerApellidoState, setPrimerApellido] = useState(null);
  const [segundoApellido, setSegundoApellido] = useState(null);
  const [alias, setAlias] = useState(null);
  const [curp, setCurp] = useState(null);
  const [otraClaveIdentidad, setOtraClaveIdentidad] = useState(null);
  const [genero, setGenero] = useState(null);
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [edad, setEdad] = useState(null);
  const [municipioNacimiento, setMunicipioNacimiento] = useState(null);
  const [entidadFederativaNacimiento, setEntidadFederativaNacimiento] =
    useState(null);
  const [paisNacimiento, setPaisNacimiento] = useState(null);
  const [nacionalidad, setNacionalidad] = useState(null);
  const [grupoCorporativo, setGrupoCorporativo] = useState(null);
  const [palabrasClave, setPalabrasClave] = useState([]);
  const [personaFisica, setPersonaFisica] = useState(personaFisicaDefault);
  const [documentos, setDocumentos] = useState([]);
  const [confirmar, setConfirmar] = useState(false);
  const [upload, setUpload] = useState(false);

  React.useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    let ls = null;

    if (esConyuge) {
      ls = getStorageItem("personaFisicaConyugeStored");
    } else {
      ls = getStorageItem("personaFisicaStored");
    }

    // console.log("PERSONA", ls);

    if (ls) {
      changeFieldValue(ls?.idPersonaFisica, "idPersonaFisica");
      changeFieldValue(ls?.ocupacion, "ocupacion");
      changeFieldValue(ls?.nombre, "nombre");
      changeFieldValue(ls?.primerApellido, "primerApellido");
      changeFieldValue(ls?.segundoApellido, "segundoApellido");
      changeFieldValue(ls?.alias, "alias");
      changeFieldValue(ls?.curp, "curp");
      changeFieldValue(ls?.rfc, "rfc");
      changeFieldValue(ls?.otraClaveIdentidad, "otraClaveIdentidad");
      changeFieldValue(ls?.genero, "genero");
      changeFieldValue(ls?.fechaNacimiento, "fechaNacimiento");
      changeFieldValue(ls?.edad, "edad");
      changeFieldValue(
        ls?.entidadFederativaNacimiento,
        "entidadFederativaNacimiento"
      );
      changeFieldValue(ls?.municipioNacimiento, "municipioNacimiento");
      changeFieldValue(ls?.nacionalidad, "nacionalidad");
      changeFieldValue(ls?.paisNacimiento, "paisNacimiento");
      changeFieldValue(ls?.grupoCorporativo || null, "grupoCorporativo");
      changeFieldValue(ls?.palabrasClave || [], "palabrasClave");
      setPersonaFisica(ls);
    }

    if (ls?.identificaciones?.length > 0) {
      setDocumentos(ls.identificaciones);
    }

    const [catOcupac, catEntFed, catPaises, catGenero, catNacion, catGruCor] =
      await Promise.all([
        getCatalogo("ocupaciones"),
        getCatalogo("entidadesFederativas"),
        getCatalogo("paises"),
        getCatalogo("generos"),
        getCatalogo("nacionalidades"),
        getCatalogo("gruposCorporativos"),
      ]);

    setCatalogoOcupaciones(catOcupac);
    setCatalogoEntidadFederativaNacimiento(catEntFed);
    setCatalogoPaisNacimiento(catPaises);
    setCatalogoGeneros(catGenero);
    setCatalogoNacionalidades(catNacion);
    setCatGrupoCorporativo(catGruCor);
  };

  useEffect(() => {
    if (idPersonaFisica) {
      setUpload(true);
    } else {
      setUpload(false);
    }
  }, [idPersonaFisica]);

  // Gestion de campos

  const getFieldName = (param) => {
    return "personaFisica." + param;
  };

  const calcularEdad = (val) => {
    if (!val) {
      changeFieldValue("", "edad");
      return;
    }

    const fecha1 = moment(val);
    const fecha2 = moment();
    changeFieldValue(fecha2.diff(fecha1, "years"), "edad");
  };

  const cargarMunicipiosDeEntidad = async (val) => {
    if (!val?.value) {
      setCatalogoMunicipioNacimiento([]);
      return;
    }
    const cat = await getCatalogo("municipios", null, "claveCURP=" + val.value);
    setCatalogoMunicipioNacimiento(cat);
  };

  const reiniciarDatosNacimiento = () => {
    changeFieldValue(null, "entidadFederativaNacimiento");
    changeFieldValue(null, "municipioNacimiento");
    changeFieldValue(null, "paisNacimiento");
  };

  const validarNacionalidad = (val) => {
    if (!val?.value) return;
    const p = catalogoPaisNacimiento.find((a) => +a.value === +val.value);
    if (p) setPaisNacimiento(p);
  };

  // Preserva los datos en la memoria en tiempo real (Genera un bug en datos fiscales)
  // const actualizarStorage = () => {
  //   let body = { personaFisica, ...getValues().personaFisica };
  //   body["identificaciones"] = documentos;
  //   if (esConyuge) {
  //     setStorageItem("personaFisicaConyugeStored", body);
  //   } else {
  //     setStorageItem("personaFisicaStored", body);
  //   }
  // };

  // useEffect(() => {
  //   actualizarStorage();
  // }, [documentos]);

  const changeFieldValue = async (val, param) => {
    setValue(getFieldName(param), val);
    switch (param) {
      case "idPersonaFisica":
        setIdPersonaFisica(val);
        break;
      case "ocupacion":
        setOcupacion(val);
        break;
      case "nombre":
        setNombre(val);
        break;
      case "primerApellido":
        setPrimerApellido(val);
        break;
      case "segundoApellido":
        setSegundoApellido(val);
        break;
      case "alias":
        setAlias(val);
        break;
      case "curp":
        setCurp(val);
        break;
      case "otraClaveIdentidad":
        setOtraClaveIdentidad(val);
        break;
      case "genero":
        setGenero(val);
        break;
      case "fechaNacimiento":
        setFechaNacimiento(val);
        break;
      case "edad":
        setEdad(val);
        break;
      case "municipioNacimiento":
        setMunicipioNacimiento(val);
        break;
      case "entidadFederativaNacimiento":
        setEntidadFederativaNacimiento(val);
        cargarMunicipiosDeEntidad(val);
        break;
      case "paisNacimiento":
        setPaisNacimiento(val);
        break;
      case "nacionalidad":
        setNacionalidad(val);
        validarNacionalidad(val);
        break;
      case "grupoCorporativo":
        setGrupoCorporativo(val);
        break;
      case "palabrasClave":
        setPalabrasClave(val);
        break;
    }
    // actualizarStorage();
  };

  const getError = (param) => {
    return errors && errors.personaFisica && errors.personaFisica[param]
      ? errors.personaFisica[param]
      : undefined;
  };

  // Rellenar datos de nacimiento con el CURP
  useEffect(() => {
    entidadFederativaCurp();
    generoCurp();
    fechaNacimientoCurp();
  }, [curp]);

  useEffect(() => {
    if (Object.keys(errors)?.length > 0) {
      ToastWarning("Favor de completar los campos obligatorios");
    }
  }, [errors]);

  const fechaNacimientoCurp = () => {
    let temp = null;
    if (!curp) {
      changeFieldValue(null, "fechaNacimiento");
      calcularEdad(null);
      return;
    }

    const arrCurp = Array.from(curp);
    if (arrCurp?.length < 9) {
      changeFieldValue(null, "fechaNacimiento");
      calcularEdad(null);
      return;
    }

    let fecha = `${arrCurp[4]}${arrCurp[5]}-${arrCurp[6]}${arrCurp[7]}-${arrCurp[8]}${arrCurp[9]}`;
    if (!moment(fecha, "YY-MM-DD").isValid()) {
      changeFieldValue(null, "fechaNacimiento");
      calcularEdad(null);
      return;
    }

    temp = moment(fecha, "YY-MM-DD").format("YYYY-MM-DD");
    let diff = moment().diff(moment(temp), "years");
    if (diff < 0) temp = moment(temp).add(-100, "years");
    if (temp) {
      changeFieldValue(temp, "fechaNacimiento");
      calcularEdad(datePickerFormat(temp));
    }
  };

  const generoCurp = async () => {
    if (!curp) return;

    let temp = null;
    const arrCurp = Array.from(curp);
    if (arrCurp?.length >= 11)
      temp = catalogoGeneros.find((a) => a.value === arrCurp[10]);

    if (temp) changeFieldValue(temp, "genero");
  };

  const entidadFederativaCurp = async () => {
    const claveCurpEntidadFederativa = await getEFCURP();
    validarNacionalidadPorClaveCURPEntidad(claveCurpEntidadFederativa);
    if (!claveCurpEntidadFederativa) return;

    let temp = catalogoEntidadFederativaNacimiento.find(
      (a) => a.value.toUpperCase() === claveCurpEntidadFederativa.toUpperCase()
    );

    if (temp) changeFieldValue(temp, "entidadFederativaNacimiento");
  };

  const getEFCURP = async () => {
    if (!curp) return;

    const arrCurp = Array.from(curp);
    if (arrCurp?.length < 13) return;

    return arrCurp[11] + arrCurp[12];
  };

  // Si es extranjero, campos de nacionalidad cambian a textfield, sino cambian a autocomplete
  const validarNacionalidadPorClaveCURPEntidad = (clave) => {
    if (!clave) return;

    const n = catalogoNacionalidades.find((a) => +a.value === 484);
    if (n) changeFieldValue(n, "nacionalidad");

    if (clave.toUpperCase() === "NE") {
      reiniciarDatosNacimiento();
    } else {
      const p = catalogoPaisNacimiento.find((a) => +a.value === 484);
      if (p) changeFieldValue(p, "paisNacimiento");
    }
  };

  // Submit
  const onSubmit = async (values) => {
    if (!values) {
      ToastWarning("Favor de corregir los campos con errores");
      return;
    }
    if (!filtrarDocumentosCargados(documentos)?.length) {
      ToastWarning("Favor de cargar los documentos de identificación");
      return;
    }
    setIsLoading(true);
    const body = values.personaFisica;
    body["identificaciones"] = documentos;

    // Filtrar documentos cargados
    if (filtrarDocumentosNoCargados(documentos)?.length > 0) {
      body["identificaciones"] = filtrarDocumentosCargados(documentos);
      setDocumentos(body["identificaciones"]);
    }

    let response = null;
    if (idPersonaFisica) {
      response = await APIRequest.put(
        process.env.personas_api_service +
          process.env.personas_fisicas_service.actualizarDatosGenerales +
          "/" +
          idPersonaFisica,
        body
      );
    } else {
      response = await APIRequest.post(
        process.env.personas_api_service +
          process.env.personas_fisicas_service.crear,
        body
      );
    }

    if (response?._id) {
      if (esConyuge) {
        ToastInfo("Se cerrará esta pestaña dentro de 5 segundos");
        setTimeout(() => {
          window.close();
        }, 5000);
      } else {
        setStorageItem("personaFisicaStored", response);
        setPersonaFisica(response);
        init();
        // router.push("/personas/fisicas?id=" + response?.idPersonaFisica);
      }
    }
    setIsLoading(false);
  };

  const generarCURP = () => {
    const nombre = getValues(getFieldName("nombre"));
    const primerApellido = getValues(getFieldName("primerApellido"));

    const a = calculaCURP(
      nombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento,
      genero?.value || null,
      entidadFederativaNacimiento?.value || null
    );
    const b = calculaRFC(
      nombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento
    );
    if (a) changeFieldValue(a, "curp");
    if (b) changeFieldValue(b, "rfc");
  };

  const validarCURP = () => {
    alert("Modulo RPA");
  };

  const cancelar = async () => {
    if (!idPersonaFisica) {
      for (let doc of documentos) {
        if (doc.blobName && doc.fileUrl) {
          await eliminarDocumento("personaFisica", doc.id);
        }
      }
    }
    clickCancelar();
  };

  const confirmarEliminacion = () => {
    setConfirmar(true);
  };

  const esMexicano = (_nacionalidad) => +_nacionalidad?.value === 484;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridContainer>
          <GridItem className={classes.root} xs={12} md={6} lg={6}>
            <Controller
              name={getFieldName("idPersonaFisica")}
              control={control}
              className="hidden"
              defaultValue={idPersonaFisica}
            />

            <GridContainer>
              {!filtrarDocumentosCargados(documentos)?.length ? (
                <>
                  <GridItem xs={12}>
                    <Alert variant="filled" severity="warning">
                      {"Favor de cargar un documento de identificación"}
                    </Alert>
                  </GridItem>

                  <GridItem xs={12} style={{ marginTop: "1.5rem" }} />
                </>
              ) : null}

              {!upload ? (
                <>
                  <GridItem xs={12} align="center">
                    <Button
                      type="button"
                      color="primary"
                      startIcon={<CloudUpload fontSize="large" />}
                      onClick={() => setUpload(true)}
                    >
                      Cargar documento
                    </Button>
                  </GridItem>

                  <GridItem xs={12} style={{ marginTop: "1.5rem" }} />
                </>
              ) : null}

              <GridItem xs={12}>
                <AutocompleteControlled
                  label="Ocupación"
                  options={catalogoOcupaciones}
                  control={control}
                  name={getFieldName("ocupacion")}
                  rules={{
                    required: true,
                  }}
                  value={ocupacion}
                  onChange={(e, val) => changeFieldValue(val, "ocupacion")}
                  err={getError("ocupacion")}
                />
              </GridItem>

              <Paper elevation={5} className={classes.paper}>
                <GridContainer>
                  <GridItem xs={12}>
                    <Typography className="ux-subtitle-1">Nombres</Typography>
                  </GridItem>

                  <GridItem xs={12}>
                    <TextFieldControlledV2
                      label="Nombre"
                      control={control}
                      name={getFieldName("nombre")}
                      rules={{
                        required: true,
                        minLength: 2,
                        maxLength: 150
                      }}
                      err={getError("nombre")}/>
                  </GridItem>

                  <GridItem xs={12} md={12} lg={6}>
                    <TextFieldControlledV2
                      label="Primer apellido"
                      control={control}
                      name={getFieldName("primerApellido")}
                      rules={{
                        required: true,
                        minLength: 2,
                        maxLength: 150
                      }}
                      err={getError("primerApellido")}/>
                  </GridItem>

                  <GridItem xs={12} md={12} lg={6}>
                    <TextFieldControlled
                      label="Segundo apellido"
                      name={getFieldName("segundoApellido")}
                      control={control}
                      value={segundoApellido}
                      rules={{
                        maxLength: 150,
                      }}
                      onChange={(e, val) =>
                        changeFieldValue(e.target.value, "segundoApellido")
                      }
                      err={getError("segundoApellido")}
                    />
                  </GridItem>

                  <GridItem xs={12}>
                    <TextAreaControlled
                      label="También se hace llamar como"
                      control={control}
                      name={getFieldName("alias")}
                      value={alias}
                      rules={{
                        maxLength: 512,
                      }}
                      onChange={(e, val) =>
                        changeFieldValue(e.target.value, "alias")
                      }
                      err={getError("alias")}
                    />
                  </GridItem>
                </GridContainer>
              </Paper>

              <Identificaciones
                classes={classes}
                control={control}
                setValue={setValue}
                getValues={getValues}
                err={errors}
                persona={personaFisica}
                setPersona={setPersonaFisica}
                documentos={documentos}
                setDocumentos={setDocumentos}
                personaLabel={"personaFisica"}
                documentoKey={"identificaciones"}
              />

              <Paper elevation={5} className={classes.paper}>
                <GridContainer>
                  <GridItem xs={12}>
                    <Typography className="ux-subtitle-1">
                      Datos de nacimiento y nacionalidad
                    </Typography>
                  </GridItem>

                  <GridItem xs={12} md={12} lg={5}>
                    <AutocompleteControlled
                      label="Género"
                      options={catalogoGeneros}
                      control={control}
                      name={getFieldName("genero")}
                      rules={{
                        required: true,
                      }}
                      value={genero}
                      onChange={(e, val) => changeFieldValue(val, "genero")}
                      err={getError("genero")}
                    />
                  </GridItem>

                  <GridItem xs={12} md={12} lg={5}>
                    <DatePickerControlled
                      label="Fecha de nacimiento"
                      value={fechaNacimiento}
                      name={getFieldName("fechaNacimiento")}
                      control={control}
                      rules={{
                        required: true,
                      }}
                      onChange={(e, val) => {
                        changeFieldValue(
                          datePickerFormat(val),
                          "fechaNacimiento"
                        );
                        calcularEdad(datePickerFormat(val));
                      }}
                      err={getError("fechaNacimiento")}
                    />
                  </GridItem>

                  <GridItem xs={12} md={12} lg={2}>
                    <NumberFieldControlled
                      label="Edad"
                      name={getFieldName("edad")}
                      control={control}
                      value={edad}
                      //   rules={{
                      //     required: true,
                      //   }}
                      //   onChange={(e, val) =>
                      //     changeFieldValue(e.target.value, "edad")
                      //   }
                      disabled={true}
                      //   err={getError("edad")}
                    />
                  </GridItem>

                  <GridItem xs={12} md={12} lg={6}>
                    {!esMexicano(nacionalidad) ? (
                      <TextFieldControlled
                        label="Municipio"
                        name={getFieldName("municipioNacimiento")}
                        control={control}
                        rules={{
                          maxLength: 150,
                        }}
                        value={municipioNacimiento}
                        onChange={(e, val) =>
                          changeFieldValue(
                            e.target.value,
                            "municipioNacimiento"
                          )
                        }
                        err={getError("municipioNacimiento")}
                      />
                    ) : (
                      <AutocompleteControlled
                        label="Municipio"
                        options={catalogoMunicipioNacimiento}
                        control={control}
                        name={getFieldName("municipioNacimiento")}
                        value={municipioNacimiento}
                        onChange={(e, val) =>
                          changeFieldValue(val, "municipioNacimiento")
                        }
                      />
                    )}
                  </GridItem>

                  <GridItem xs={12} md={12} lg={6}>
                    {!esMexicano(nacionalidad) ? (
                      <TextFieldControlled
                        label="Entidad federativa"
                        name={getFieldName("entidadFederativaNacimiento")}
                        control={control}
                        rules={{
                          maxLength: 150,
                          required: true,
                        }}
                        value={entidadFederativaNacimiento}
                        onChange={(e, val) =>
                          changeFieldValue(
                            e.target.value,
                            "entidadFederativaNacimiento"
                          )
                        }
                        err={getError("entidadFederativaNacimiento")}
                      />
                    ) : (
                      <AutocompleteControlled
                        label="Entidad federativa"
                        options={catalogoEntidadFederativaNacimiento}
                        control={control}
                        name={getFieldName("entidadFederativaNacimiento")}
                        rules={{
                          required: true,
                        }}
                        value={entidadFederativaNacimiento}
                        onChange={(e, val) => {
                          changeFieldValue(val, "entidadFederativaNacimiento");
                        }}
                        err={getError("entidadFederativaNacimiento")}
                      />
                    )}
                  </GridItem>

                  <GridItem xs={12} md={12} lg={6}>
                    <AutocompleteControlled
                      label="País"
                      options={catalogoPaisNacimiento}
                      control={control}
                      name={getFieldName("paisNacimiento")}
                      rules={{
                        required: true,
                      }}
                      value={paisNacimiento}
                      onChange={(e, val) =>
                        changeFieldValue(val, "paisNacimiento")
                      }
                      err={getError("paisNacimiento")}
                    />
                  </GridItem>

                  <GridItem xs={12} md={12} lg={6}>
                    <AutocompleteControlled
                      label="Nacionalidad"
                      options={catalogoNacionalidades}
                      control={control}
                      name={getFieldName("nacionalidad")}
                      rules={{
                        required: true,
                      }}
                      value={nacionalidad}
                      onChange={(e, val) => {
                        changeFieldValue(val, "nacionalidad");
                        changeFieldValue(null, "entidadFederativaNacimiento");
                        changeFieldValue(null, "municipioNacimiento");
                      }}
                      err={getError("nacionalidad")}
                    />
                  </GridItem>
                </GridContainer>
              </Paper>

              <Paper elevation={5} className={classes.paper}>
                <GridContainer>
                  <GridItem xs={12}>
                    <Typography className="ux-subtitle-1" variant="h6">
                      Claves de identidad
                    </Typography>
                  </GridItem>

                  <GridItem xs={12} md={12} lg={6}>
                    <TextFieldControlled
                      label="CURP"
                      name={getFieldName("curp")}
                      control={control}
                      value={curp}
                      rules={{
                        required: true,
                        minLength: 1,
                        maxLength: 18,
                      }}
                      onChange={(e, val) =>
                        changeFieldValue(e.target.value, "curp")
                      }
                      err={getError("curp")}
                    />
                  </GridItem>

                  <GridItem xs={12} md={12} lg={6}>
                    <TextFieldControlled
                      label="Otra clave de identidad"
                      name={getFieldName("otraClaveIdentidad")}
                      control={control}
                      value={otraClaveIdentidad}
                      rules={{
                        maxLength: 32,
                      }}
                      onChange={(e, val) =>
                        changeFieldValue(e.target.value, "otraClaveIdentidad")
                      }
                      err={getError("otraClaveIdentidad")}
                    />
                  </GridItem>

                  <GridItem xs={12}>
                    {/* <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      onClick={() => validarCURP()}
                    >
                      Validar CURP
                    </Button>
                    &nbsp; */}
                    <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      onClick={() => generarCURP()}
                    >
                      Generar CURP
                    </Button>
                  </GridItem>
                </GridContainer>
              </Paper>

              {!esConyuge && (
                <>
                  <DatosDomicilio
                    classes={classes}
                    control={control}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                    persona={"personaFisica"}
                    esFiscal={false}
                  />

                  <EstadoCivil
                    classes={classes}
                    control={control}
                    setValue={setValue}
                    errors={errors}
                    documentos={documentos}
                    esConyuge={esConyuge}
                  />

                  <GridItem xs={12}>
                    <AutocompleteControlled
                      label="Grupo Corporativo"
                      options={catGrupoCorporativo}
                      control={control}
                      name={getFieldName("grupoCorporativo")}
                      rules={{
                        required: false,
                      }}
                      value={grupoCorporativo}
                      onChange={(e, val) =>
                        changeFieldValue(val, "grupoCorporativo")
                      }
                      err={getError("grupoCorporativo")}
                    />
                  </GridItem>

                  <GridItem xs={12}>
                    <AutocompleteMultiChipControlled
                      label="Palabras Clave"
                      options={[]}
                      control={control}
                      name={getFieldName("palabrasClave")}
                      rules={{
                        required: false,
                      }}
                      value={palabrasClave}
                      onChange={(e, val) =>
                        changeFieldValue(val, "palabrasClave")
                      }
                      err={getError("palabrasClave")}
                    />
                  </GridItem>
                </>
              )}

              <GridItem xs={12} style={{ marginTop: "1.5rem" }} />
            </GridContainer>
          </GridItem>

          <GridItem className={classes.root} xs={12} md={6} lg={6}>
            {upload ? (
              <CarruselDocumentos
                control={control}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                documentoKey={"identificaciones"}
                entidadKey={"personaFisica"}
                idKey={"idPersonaFisica"}
                entidad={personaFisica}
                setEntidad={setPersonaFisica}
                documentos={documentos}
                setDocumentos={setDocumentos}
                esConyuge={esConyuge}
                filterSection={"Generales"}
                changeFieldValue={changeFieldValue}
              />
            ) : null}
          </GridItem>

          <GridItem xs={12} align="right" className={classes.fabActionsRight}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              startIcon={<CancelIcon />}
              onClick={() => confirmarEliminacion()}
            >
              Cancelar
            </Button>
            &nbsp;
            <Button
              id="guardar-btn"
              variant="contained"
              type="submit"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Guardar
            </Button>
          </GridItem>
        </GridContainer>
      </form>

      <AlertDialog
        open={confirmar ? true : false}
        setOpen={setConfirmar}
        done={() => cancelar()}
        text={
          "Perderá permanentemente los datos y documentos no guardados. ¿Desea continuar?"
        }
      />
    </>
  );
}
