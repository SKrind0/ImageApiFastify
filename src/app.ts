import app from "./server";

async function Start() {
  app.listen(
    {
      port: Number(process.env.PORT) || 3002,
      host: process.env.HOST || "localhost",
    },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    }
  );
}

Start();
