# Firebase Batch Splitter

A tool to exceed Firebase limitations for batched writes.

This should become an NPM package sooner. At the moment you can just take a BatchSplitter class and use in next way:

```ts
import BatchSplitter from "./index";

// Initialize Firestore in your project
import * as functions from "firebase-functions";
const admin = require("firebase-admin");
const app = admin.initializeApp();
const db = app.firestore();

exports.default = functions.https.onCall(async () => {
  // Initialize batch for your database.
  // 100 is one batch size, if not set then equals to 500.
  const batch = new BatchSplitter(db, 100);
  
  // Add actions to batch
  const articles = await db.collection("articles").get();
  
  for (const article of articles.docs) {
    batch.delete(article.ref);
  }
  
  // Commit just as with normal batch operation
  await batch.commit();
  
  return;
})
```

### Available actions:

- `batch.delete(documentRef)`
- `batch.set(documentRef, data)`
- `batch.update(documentRef, data)`
