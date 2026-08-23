
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
  const query = `SELECT id, email, name, surname, password, role FROM USERS WHERE email = ?`;
  return query;
};

const getUserById = (): string => {
  const query = `SELECT id, email, name, surname, password, role FROM USERS WHERE id = ?`;
  return query;
};

export { isUser, createUser,getUserByEmail, getUserById };
