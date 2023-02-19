import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';

// export async function handler(event, context) {}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // $env:DATABASE_URL = "postgresql://dbadmin:cwKPcdBvwkFsX9Sd4RiNFA@qenglish-3881.6xw.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"
  const connectionString =
    'postgresql://dbadmin:cwKPcdBvwkFsX9Sd4RiNFA@qenglish-3881.6xw.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full';

  // const client = new Client(process.env.DATABASE_URL);
  const client = new Client(connectionString);

  await client.connect();
  try {
    const results = await client.query('SELECT NOW()');
    console.log(results);

    const query = 'INSERT INTO public.testtable (student) VALUES ($1)';
    const values = [Date.now()];
    let inserts = await client.query(query, values);

    return {
      statusCode: 200,
      body: JSON.stringify(inserts),
    };
  } catch (err) {
    console.error('error executing query:', err);
  } finally {
    client.end();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World' }),
  };
};

