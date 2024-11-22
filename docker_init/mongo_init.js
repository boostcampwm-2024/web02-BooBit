db = db.getSiblingDB("boobit");
try {
  db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [
      { role: "dbAdmin", db: "boobit" },
      { role: "readWrite", db: "boobit" },
    ],
  });
  quit(0);
} catch (error) {
  quit(1);
}
