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

  const webResource = formContext.getControl("WebResource_Ofertas");
  const clientGUID = formContext.data.entity.getId().replace(/[{}]/g, "");

  if (!webResource || !clientGUID) return;

  try {
    const window = await webResource.getContentWindow();
    const res = await Xrm.WebApi.online.execute(
      new new_ApiParameters(clientGUID)
    );

    const data = await res.json();

    window.populateTable(
      data.value.map((v) => {
        return {
          guid: v.crbe4_productoaofrecerid,
          name: v.crbe4_nombre,
          expirationDate: v.crbe4_fechavigencia,
          client: clientGUID,
        };
      })
    );
  } catch (error) {
    Xrm.Navigation.openAlertDialog(
      { title: "Error inesperado", text: error.message },
      { height: 200, width: 500 }
    );
  }

  function new_ApiParameters(crbe4_clientes) {
    this.crbe4_clientes = crbe4_clientes;
    this.getMetadata = function () {
      return {
        operationName: "crbe4_apiproductosclientes",
        boundParameter: null,
        parameterTypes: {
          crbe4_clientes: {
            typeName: "Edm.Guid",
            structuralProperty: 5,
          },
        },
        operationType: 0,
      };
    };
  }
}
