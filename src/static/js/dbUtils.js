export function makeUrl(url, params) { // TODO put this in separate (utilities) file
  let url_obj = new URL(url);
  if (params) {
    Object.keys(params).forEach(key => url_obj.searchParams.append(key, params[key]))
  }
  return url_obj;
}