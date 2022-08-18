export const cssResizer = {
  _hover: {
    ".resizer": {
      background: "#482017",
    },
  },
  ".resizer": {
    display: "inline-block",
    position: "absolute",
    width: "1px",
    height: "90%",
    right: "0",
    top: "0",
    transform: "translateX(50%)",
    zIndex: "1",
    touchAction: "none",
    "&.isResizing": {
      background: "#482017",
    },
  },
};