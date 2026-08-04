
const isUser= (): string => {
  const query = `SELECT EXISTS(SELECT 1 FROM users WHERE email = ?) AS "exists"`;
  return query;
};

const createUser = (): string => {
  const query = `
    INSERT INTO USERS (id,email,name,surname, password, role) 
    VALUES (?, ?, ?, ?,?,'cliente')
  `;
  return query;


};

const getUserByEmail = (): string => {
  return `SELECT id, email, name, surname, password, role FROM USERS WHERE email = ?`;
};

export { isUser, createUser,getUserByEmail };
