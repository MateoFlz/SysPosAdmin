import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { environment } from "./environment.ts";

const firebaseApp = initializeApp(environment.firebase);

export const auth = getAuth(firebaseApp);
