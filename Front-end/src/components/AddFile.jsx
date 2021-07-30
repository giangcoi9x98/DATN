import React, { memo, useMemo } from "react";
import isArray from "lodash/fp/isArray";
import isString from "lodash/fp/isString";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from "@material-ui/core/IconButton/IconButton";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  label: {},
  button: {}
}));

const acceptVariants = {
  word:
    ".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  images: "image/*",
  excel:
    ".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

const makeAcceptString = accept => {
  if (!accept || !accept.length) {
    return "";
  }

  if (isString(accept)) {
    return acceptVariants[accept] ? acceptVariants[accept] : accept;
  }

  if (isArray(accept)) {
    const len = accept.length;
    return accept.reduce((acc, curr, currIndex) => {
      if (acceptVariants[curr]) {
        acc += acceptVariants[curr];
      } else if (curr && curr.length && curr.trim().length) {
        acc += curr.trim();
      }

      if (len > 1 && currIndex < len - 1) {
        acc += ",";
      }

      return acc;
    }, "");
  }

  return "";
};

const FileInput = memo(({
  accept,
  multiple = false,
  id = "file-input",
  inputProps,
  labelProps,
  buttonProps,
  onChange,
}) => {
  const classes = useStyles();

  const acceptString = useMemo(() => makeAcceptString(accept), [accept]);

  return (
    <div className={classes.container}>
      <FormControl className={classes.formControl}>
        <input
          id={id}
          accept={acceptString}
          className={classes.input}
          multiple={multiple}
          type="file"
          onChange={(e) => console.log(e.target.files)}
          {...inputProps}
        />
        <label className={classes.label} htmlFor={id} {...labelProps}>
          <IconButton
            variant="contained"
            component="span"
            className={classes.button}
            {...buttonProps}
            
          >
            <AddCircleOutlineIcon></AddCircleOutlineIcon>
          </IconButton>
        </label>
      </FormControl>
    </div>
  );
});

export default FileInput;
