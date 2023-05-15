const FORM_TYPE_READ_ONLY = 3;

function showOnReadOnly(executionContext, ...labelsToHide) {
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
  for (const label of labelsToHide) {
    const formField = formContext.getControl(label);
    if (formType === FORM_TYPE_READ_ONLY) formField.setVisible(true);
    else formField.setVisible(false);
  }
}
