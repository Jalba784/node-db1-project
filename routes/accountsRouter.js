const express = require("express");
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const accounts = await db.select("*").from("accounts");

    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    /* By destructuring 'accounts' only the object is returned. */
    const [accounts] = await db // destructured 'accounts'
      .select("*")
      .from("accounts")
      .where("id", req.params.id)
      .limit(1);

    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = {
      // the database will automatically generate the ID and dates
      name: req.body.name,
      budget: req.body.budget
    };
    // translates to `INSERT INTO "accounts" ("name", "budget") VALUES (?, ?);`
    const [accountID] = await db.insert(payload).into("accounts");
    // calling `.first()` is doing the same thing as `.limit(1)` and destructuring the result
    const account = await db
      .first("*")
      .from("accounts")
      .where("id", accountID);

    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const payload = {
      // the database will automatically generate the ID and dates
      name: req.body.name,
      budget: req.body.budget
    };
    // translates to `UPDATE "accounts" SET ? = ?  WHERE "id" = ?;`
    await db("accounts")
      .update(payload)
      .where("id", req.params.id);
    const account = await db
      .first("*")
      .from("accounts")
      .where("id", req.params.id);

    res.json(account);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    // translates to `DELETE FROM "accounts" WHERE "id" = ?;`
    await db("accounts")
      .where("id", req.params.id)
      .del();
    // since we no longer have a resource to return,
    // just send a 204 which means "success, but no response data is being sent"
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
