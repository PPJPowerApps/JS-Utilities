async function callAction(executionContext) {
  const formContext = executionContext.getFormContext();
  /*
        Value	Form type
        0	    Undefined
        1	    Create
        2	    Update
        3	    Read Only
        4	    Disabled
        6	    Bulk Edit
      */
  const formType = formContext.ui.getFormType();
  if (formType !== 2) return;

  const productoField = formContext.getAttribute("crbe4_productoaofrecer");

  const producto = productoField.getValue();

  if (!producto) return;

  const prospectoGUID = formContext.data.entity.getId().replace(/[{}]/g, "");
  const productoGUID = producto[0].id.replace(/[{}]/g, "");

  if (!prospectoGUID || !productoGUID) return;

  function new_ApiParameters(crbe4_prospecto, crbe4_productoaofrecer) {
    this.crbe4_prospecto = crbe4_prospecto;
    this.crbe4_productoaofrecer = crbe4_productoaofrecer;
    this.getMetadata = function () {
      return {
        operationName: "crbe4_apiproductosofertados",
        boundParameter: null,
        parameterTypes: {
          crbe4_prospecto: {
            typeName: "Edm.Guid",
            structuralProperty: 5,
          },
          crbe4_productoaofrecer: {
            typeName: "Edm.Guid",
            structuralProperty: 5,
          },
        },
        operationType: 0,
      };
    };
  }

  try {
    const res = await Xrm.WebApi.online.execute(
      new new_ApiParameters(prospectoGUID, productoGUID)
    );
    const data = await res.json();
    if (data.respuesta) {
      Xrm.Navigation.openAlertDialog(
        {
          title: "No se ha podido asignar este producto",
          text: "Este producto ya fue ofrecido anteriomente, por favor selecciona otro.",
        },
        { height: 200, width: 500 }
      );
      productoField.setValue(null);
    }
  } catch (error) {
    productoField.setValue(null);
    Xrm.Navigation.openAlertDialog(
      { title: "Error inesperado", text: error.message },
      { height: 200, width: 500 }
    );
    console.error(error);
  }
}
