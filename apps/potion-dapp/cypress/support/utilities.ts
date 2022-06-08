// Alias query if operationName matches
// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req: any, operationName: string) => {
  const { body } = req;
  return (
    Object.prototype.hasOwnProperty.call(body, "operationName") &&
    body.operationName === operationName
  );
};

// Alias query if operationName matches
export const aliasQuery = (req: any, operationName: string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `${operationName}`;
  }
};
