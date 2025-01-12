const createRestaurant = () => {
    const query = `INSERT IGNORE INTO RESTAURANT (Id,Email,Name,Address) VALUES (?, ?, ?, ?);`;
    return query;
};

export {createRestaurant}