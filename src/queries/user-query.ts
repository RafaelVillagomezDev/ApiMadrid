
const isUser= (): string => {
  const query = `SELECT EXISTS(SELECT 1 FROM users WHERE email = ?) AS "exists"`;
  return query;
};

const registerUser = (): string => {
  const query = `
    INSERT INTO USERS (id, name, email, password, role) 
    VALUES (?, ?, ?, ?, 'cliente')
  `;
  return query;
};

export { isUser, registerUser };
