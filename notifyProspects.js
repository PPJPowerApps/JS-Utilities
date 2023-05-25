function notify(primaryControl, columnName, flowURL) {
  const grid = primaryControl.getGrid();
  const rows = grid.getRows();
  const actives = [];
  rows.forEach((row) => {
    row.data
      .getEntity()
      .attributes.getAll()
      .forEach((column) => {
        if (column.getName() === columnName) actives.push(column.getValue());
      });
  });

  const data = {
    actives,
  };
  fetch(flowURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
}
