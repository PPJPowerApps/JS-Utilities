function notify(flowURL) {
  fetch(flowURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
}
