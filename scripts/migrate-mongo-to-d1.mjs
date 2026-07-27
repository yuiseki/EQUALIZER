import { MongoClient } from "mongodb";
import fs from "node:fs";

const env = fs.readFileSync(".env.vercel", "utf-8");
const mongoUrl = env.match(/^DATABASE_URL="?([^"\n]+)"?/m)[1];

const client = new MongoClient(mongoUrl);
await client.connect();
const db = client.db();

const esc = (v) => {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (v instanceof Date) return `'${v.toISOString()}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
};

const oid = (v) => (v ? String(v) : null);

const lines = [];

const users = await db.collection("users").find().toArray();
for (const u of users) {
  // A couple of source rows have email: "" and the column is NOT NULL +
  // UNIQUE, so two empty strings collide. Synthesize a unique placeholder
  // from the row's own id rather than relaxing the NOT NULL constraint.
  const email = u.email ? u.email : `no-email+${oid(u._id)}@equalizer.invalid`;
  lines.push(
    `INSERT INTO users (id, createdAt, updatedAt, name, email, verifiedAt, image) VALUES (${esc(
      oid(u._id)
    )}, ${esc(u.createdAt)}, ${esc(u.updatedAt)}, ${esc(u.name)}, ${esc(
      email
    )}, ${esc(u.verifiedAt)}, ${esc(u.image)});`
  );
}

const conversations = await db.collection("conversations").find().toArray();
for (const c of conversations) {
  lines.push(
    `INSERT INTO conversations (id, createdAt, updatedAt, userId, topic, description) VALUES (${esc(
      oid(c._id)
    )}, ${esc(c.createdAt)}, ${esc(c.updatedAt)}, ${esc(oid(c.userId))}, ${esc(
      c.topic
    )}, ${esc(c.description)});`
  );
}

const comments = await db.collection("comments").find().toArray();
for (const c of comments) {
  lines.push(
    `INSERT INTO comments (id, createdAt, updatedAt, userId, conversationId, text) VALUES (${esc(
      oid(c._id)
    )}, ${esc(c.createdAt)}, ${esc(c.updatedAt)}, ${esc(oid(c.userId))}, ${esc(
      oid(c.conversationId)
    )}, ${esc(c.text)});`
  );
}

const votes = await db.collection("votes").find().toArray();
for (const v of votes) {
  lines.push(
    `INSERT INTO votes (id, createdAt, updatedAt, userId, commentId, value) VALUES (${esc(
      oid(v._id)
    )}, ${esc(v.createdAt)}, ${esc(v.updatedAt)}, ${esc(oid(v.userId))}, ${esc(
      oid(v.commentId)
    )}, ${esc(v.value)});`
  );
}

const accounts = await db.collection("accounts").find().toArray();
for (const a of accounts) {
  lines.push(
    `INSERT INTO accounts (id, createdAt, updatedAt, userId, type, providerAccountId, providerType, provider, refreshToken, accessToken, accessTokenExpires, tokenType, scope, idToken, sessionState, oauth_token_secret, oauth_token) VALUES (${esc(
      oid(a._id)
    )}, ${esc(a.createdAt)}, ${esc(a.updatedAt)}, ${esc(oid(a.userId))}, ${esc(
      a.type
    )}, ${esc(a.providerAccountId)}, ${esc(a.providerType)}, ${esc(
      a.provider
    )}, ${esc(a.refreshToken)}, ${esc(a.accessToken)}, ${esc(
      a.accessTokenExpires
    )}, ${esc(a.tokenType)}, ${esc(a.scope)}, ${esc(a.idToken)}, ${esc(
      a.sessionState
    )}, ${esc(a.oauth_token_secret)}, ${esc(a.oauth_token)});`
  );
}

const sessions = await db.collection("sessions").find().toArray();
let skippedSessions = 0;
for (const s of sessions) {
  // NextAuth sessions are ephemeral (recreated on next login); a handful of
  // source rows are missing `expires` (expiresAt is NOT NULL), so drop those
  // rather than guessing a value.
  if (!s.expires) {
    skippedSessions++;
    continue;
  }
  lines.push(
    `INSERT INTO sessions (id, sessionToken, userId, expiresAt) VALUES (${esc(
      oid(s._id)
    )}, ${esc(s.sessionToken)}, ${esc(oid(s.userId))}, ${esc(s.expires)});`
  );
}

fs.writeFileSync("/tmp/equalizer_data.sql", lines.join("\n"));
console.log(`Wrote ${lines.length} INSERT statements to /tmp/equalizer_data.sql`);
console.log({
  users: users.length,
  conversations: conversations.length,
  comments: comments.length,
  votes: votes.length,
  accounts: accounts.length,
  sessions: sessions.length - skippedSessions,
  skippedSessions,
});

await client.close();
