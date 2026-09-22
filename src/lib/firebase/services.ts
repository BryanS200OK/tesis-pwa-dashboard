import { collection, doc, setDoc, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";
import type { Medicion } from "./models";

export async function guardarMedicion(medicion: Medicion) {
  try {
    const medicionRef = doc(collection(db, "mediciones"), medicion.measurement_id);
    await setDoc(medicionRef, {
      ...medicion,
      server_timestamp: Date.now(),
      sync_status: "synced"
    });
    console.log("Guardado exitoso en Firebase:", medicion.measurement_id);
  } catch (error) {
    console.error("Error al guardar en Firebase:", error);
  }
}

export async function obtenerHistorial(variableFiltro: string) {
  try {
    const medicionsRef = collection(db, "mediciones");
    const querySnapshot = await getDocs(query(medicionsRef));
    
    const resultados: Medicion[] = [];
    querySnapshot.forEach((documento) => {
      resultados.push(documento.data() as Medicion);
    });
    
    return resultados;
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
}