import { Button, Paper, Typography, useTheme } from "@material-ui/core";
import React from "react";
import AutocompleteControlled from "../../Form/AutocompleteControlled";
import GridContainer from "../../Grid/GridContainer";
import GridItem from "../../Grid/GridItem";
import DeleteIcon from "@material-ui/icons/Delete";
import { CatAnioEmision, CatAnioVigencia } from "../../../utils/catalogos";
import { Controller } from "react-hook-form";
import TextFieldControlled from "../../Form/TextFieldControlled";
import TextFieldControlledV2 from "../../Form/TextFieldControlledV2";
import DatePickerControlled from "../../Form/DatePickerControlled";
import { datePickerFormat } from "../../../utils/formateadores";
import AlertDialog from "../../common/AlertDialog";
import { eliminarDocumento } from "../../../api/personasAPI";
import { ToastWarning } from "../../Toast/Toast";
import _ from "lodash";
import {
  filtrarDocumentosCargados,
  getNombreDocumento,
} from "../../../utils/objetos.utils";

export default function Identificaciones(props) {
  const {
    classes,
    persona,
    setPersona,
    control,
    setValue,
    err,
    getValues,
    documentos,
    setDocumentos,
    personaLabel,
    documentoKey,
  } = props;
  const theme = useTheme();
  const [catAnioEmision, setCatAnioEmision] = React.useState([]);
  const [catAnioVigencia, setCatAnioVigencia] = React.useState([]);
  const [confirmar, setConfirmar] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      let newList = filtrarDocumentosCargados(documentos).map((item, index) => {
        let newItem = item;
        actualizarCampos(newItem, index);
        return newItem;
      });
      setDocumentos(newList);

      const [catAniEmi, catAniVig] = await Promise.all([
        CatAnioEmision(),
        CatAnioVigencia(),
      ]);

      setCatAnioEmision(catAniEmi);
      setCatAnioVigencia(catAniVig);
    };

    init();
  }, []);

  const actualizarCampos = (newItem, index) => {
    setValue(getFieldName("id", index), newItem.id);
    setValue(
      getFieldName("numeroIdentificacion", index),
      newItem.numeroIdentificacion
    );
    setValue(getFieldName("tipoDocumento", index), newItem.tipoDocumento);
    setValue(getFieldName("anioEmision", index), newItem.anioEmision);
    setValue(getFieldName("anioVigencia", index), newItem.anioVigencia);
    setValue(getFieldName("fechaEmision", index), newItem.fechaEmision);

    setValue(getFieldName("fileUrl", index), newItem.fileUrl);
    setValue(getFieldName("blobName", index), newItem.blobName);
    setValue(getFieldName("fileFormat", index), newItem.fileFormat);
    setValue(getFieldName("fileName", index), newItem.fileName);
    setValue(getFieldName("size", index), newItem.size);
  };

  const onChange = (val, param, index) => {
    setValue(getFieldName(param, index), val);
    let newList = documentos?.map((item, i) => {
      let newItem = item;
      if (index == i) {
        newItem = _.set(newItem, param, val);
        console.log(newItem);
      }
      return newItem;
    });
    setDocumentos(newList);
    let newPersona = persona;
    newPersona[documentoKey] = newList;
    setPersona(newPersona);
  };

  const getFieldName = (param, index) => {
    return `${personaLabel}.${documentoKey}[${index}].${param}`;
  };

  const getError = (param, index) => {
    let path = getFieldName(param, index);
    return _.get(err, path);
  };

  const enfocarDocumento = (index) => {
    const btn = document.querySelector("#focus-button-hidden");
    btn.value = index;
    btn.click();
  };

  const eliminar = async (idDoc) => {
    let newList = documentos.filter((a) => a.id !== idDoc);
    setDocumentos(newList);
    await eliminarDocumento(personaLabel, idDoc);
    if (idDoc) {
      await guardarCambios();
    }
  };

  const guardarCambios = async () => {
    if (Object.keys(err)?.length > 0) {
      ToastWarning("Favor de completar los campos requeridos");
      return;
    }
    const button = document.querySelector("#btn-guardar");
    if (button) button.click();
  };

  return (
    <>
      {filtrarDocumentosCargados(documentos).map((item, index) => {
        return (
          <Paper
            elevation={5}
            className={classes.paper}
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              enfocarDocumento(index);
            }}
          >
            <GridContainer>
              <Controller
                defaultValue={item.id}
                control={control}
                className="hidden"
                name={getFieldName("id", index)}
              />

              <Controller
                defaultValue={item?.tipoDocumento?._id}
                control={control}
                className="hidden"
                name={getFieldName("tipoDocumento._id", index)}
              />

              <Controller
                defaultValue={item?.tipoDocumento?.codigo}
                control={control}
                className="hidden"
                name={getFieldName("tipoDocumento.codigo", index)}
              />

              <Controller
                defaultValue={item?.tipoDocumento?.tipoDocumento}
                control={control}
                className="hidden"
                name={getFieldName("tipoDocumento.tipoDocumento", index)}
              />

              <Controller
                defaultValue={item?.tipoDocumento?.subTipoDocumento}
                control={control}
                className="hidden"
                name={getFieldName("tipoDocumento.subTipoDocumento", index)}
              />

              <Controller
                defaultValue={item?.tipoDocumento?.nombreDocumento}
                control={control}
                className="hidden"
                name={getFieldName("tipoDocumento.nombreDocumento", index)}
              />

              <GridItem xs={12} style={{ marginTop: "1.5rem" }} />

              <GridItem className={"ux-grid-aligned"} xs={12}>
                <Typography className={"ux-subtitle-1"}>
                  {getNombreDocumento(item)}
                </Typography>
              </GridItem>

              <GridItem className={"ux-grid-aligned"} xs={12}>
                {/* <TextFieldControlled
                  label="Entidad emisora"
                  control={control}
                  name={getFieldName("tipoDocumento.entidadEmisora", index)}
                  rules={{
                    required: true,
                  }}
                  value={item?.tipoDocumento?.entidadEmisora}
                  onChange={(e, val) =>
                    onChange(
                      e.currentTarget.value,
                      "tipoDocumento.entidadEmisora",
                      index
                    )
                  }
                  err={getError("tipoDocumento.entidadEmisora", index)}
                /> */}
                <TextFieldControlledV2
                  label="Entidad emisora"
                  control={control}
                  name={getFieldName("tipoDocumento.entidadEmisora", index)}
                  rules={{
                    required: true
                  }}
                  err={getError("tipoDocumento.entidadEmisora", index)}/>
              </GridItem>

              <GridItem className={"ux-grid-aligned"} xs={12} md={12} lg={6}>
                <TextFieldControlled
                  label="Número de documento"
                  name={getFieldName("numeroIdentificacion", index)}
                  control={control}
                  value={item.numeroIdentificacion}
                  rules={{
                    required: true,
                    maxLength: 32,
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/i,
                      message: "Ingrese únicamente letras y números",
                    },
                  }}
                  onChange={(e, val) =>
                    onChange(e.target.value, "numeroIdentificacion", index)
                  }
                  err={getError("numeroIdentificacion", index)}
                />
              </GridItem>

              <GridItem className={"ux-grid-aligned"} xs={12} md={12} lg={6}>
                <DatePickerControlled
                  label="Fecha de emisión"
                  value={item.fechaEmision}
                  name={getFieldName("fechaEmision", index)}
                  control={control}
                  rules={{
                    required: false,
                  }}
                  onChange={(e, val) =>
                    onChange(datePickerFormat(val), "fechaEmision", index)
                  }
                  err={getError("fechaEmision", index)}
                />
              </GridItem>

              <GridItem className={"ux-grid-aligned"} xs={12} md={12} lg={6}>
                <AutocompleteControlled
                  label="Año de emisión"
                  options={catAnioEmision}
                  control={control}
                  name={getFieldName("anioEmision", index)}
                  rules={{
                    required: false,
                  }}
                  value={item.anioEmision}
                  onChange={(e, val) => onChange(val, "anioEmision", index)}
                  err={getError("anioEmision", index)}
                />
              </GridItem>

              <GridItem className={"ux-grid-aligned"} xs={12} md={12} lg={6}>
                <AutocompleteControlled
                  label="Año de vigencia"
                  options={catAnioVigencia}
                  control={control}
                  name={getFieldName("anioVigencia", index)}
                  rules={{
                    required: false,
                  }}
                  value={item.anioVigencia}
                  onChange={(e, val) => onChange(val, "anioVigencia", index)}
                  err={getError("anioVigencia", index)}
                />
              </GridItem>

              <GridItem xs={12} align="right">
                {documentos?.filter(
                  (a) => a.blobName !== null && a.fileUrl !== null
                )?.length > 1 ? (
                  <Button
                    type="button"
                    color="primary"
                    startIcon={<DeleteIcon />}
                    onClick={() => setConfirmar(item.id)}
                  >
                    Eliminar {getNombreDocumento(item)}
                  </Button>
                ) : (
                  ""
                )}
              </GridItem>

              <GridItem xs={12} style={{ marginTop: "1.5rem" }} />
            </GridContainer>
          </Paper>
        );
      })}

      <AlertDialog
        open={confirmar ? true : false}
        setOpen={setConfirmar}
        done={() => eliminar(confirmar)}
        text={
          "No podrá recuperar el documento con sus datos capturados. ¿Desea continuar?"
        }
      />
    </>
  );
}
