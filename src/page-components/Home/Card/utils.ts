export function handleParamsOption(params: any) {
  const paramsOption: any = {};
  Object.entries(params).map(([key, item]: any) => {
    try {
      if (typeof JSON.parse(item) === 'object') {
        paramsOption[key] = JSON.parse(item);
      } else {
        paramsOption[key] = item;
      }
    } catch (error) {
      paramsOption[key] = item;
    }
  });
  return Object.keys(paramsOption).length ? paramsOption : '';
}
