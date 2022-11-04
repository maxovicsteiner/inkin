export function censorEmail(email) {
  let output = "";
  output = output.concat(email[0]);
  let censorLimit = email.indexOf("@") - 1;
  for (let i = 1; i < censorLimit; i++) {
    output = output.concat("*");
  }
  let rest = email.slice(censorLimit, email.length);
  output = output.concat(rest);
  return output;
}
