import mysql from "mysql2/promise";

export async function query({ query, values = [] }) {
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const [data] = await dbconnection.execute(query, values);
    dbconnection.end();
    return data;
  } catch (error) {
    // throw Error(error.message);
  }
}
