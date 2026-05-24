USE DB_APIMADRID;

CREATE OR REPLACE VIEW V_RESTAURANTS AS
SELECT 
    r.id,
    r.name,
    r.email,
    r.address,
    r.description,
    r.phone,
    r.type_food,
    r.web,
    ROUND(
        (COALESCE(AVG(CASE WHEN d.category = 'entrantes' THEN d.price END), 0.00) / 2) +
        COALESCE(AVG(CASE WHEN d.category = 'principal' THEN d.price END), 0.00) +
        (COALESCE(AVG(CASE WHEN d.category = 'postres'   THEN d.price END), 0.00) * 0.33) +
        COALESCE(AVG(CASE WHEN d.category = 'bebidas'   THEN d.price END), 0.00), 
        2
    ) AS average_price
FROM RESTAURANT r
LEFT JOIN DISHES d ON r.id = d.id -- <--- Cambiado a d.id según tu estructura
GROUP BY 
    r.id, 
    r.name, 
    r.email, 
    r.address, 
    r.description, 
    r.phone, 
    r.type_food, 
    r.web;