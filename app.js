import dotenv from 'dotenv';
import { 
  getPlantByUser, 
  getPlants, 
  createPlant, 
  createUser, 
  findUser, 
  deletePlant,
  updateArduino,
  getArduino,
  getArduinoByUser,
  deleteArduino,
  API_key,
  pathUmidade,
  ContatoWeb
} from './db.js';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";



dotenv.config();
const app = express();
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/plantas", async (req, res, next) => {
  try {
    const [plantas] = await getPlants();
    res.send(plantas);
  } catch (err) {
    next(err);
  }
});

app.get("/API/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const planta = await API_key(id);
    res.send(planta);
  } catch (err) {
    next(err);
  }
});

app.get("/plantas/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const planta = await getPlantByUser(id);
    res.send(planta);
  } catch (err) {
    next(err);
  }
});

app.get("/arduino/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const planta = await getArduinoByUser(id);
    res.send(planta);
  } catch (err) {
    next(err);
  }
});

app.get("/arduinos/:cod_ard", async (req, res, next) => {
  try {
    const cod_ard = req.params.cod_ard;
    const arduino = await getArduino(cod_ard);
    res.send(arduino);
  } catch (err) {
    next(err);
  }
});

app.post("/planta", async (req, res, next) => {
  try {
    const { usuario_id, horarios, foto_url } = req.body;
    const planta = await createPlant(usuario_id, horarios, foto_url);
    res.status(201).send(planta);
  } catch (err) {
    next(err);
  }
});

app.delete("/plantas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePlant(id);

    res.status(200).json({ message: "Planta deletada com sucesso" }); 
  } catch (error) {
    console.error("Erro ao deletar planta:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.delete("/arduino/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteArduino(id);

    res.status(200).json({ message: "Arduino deletada com sucesso" }); 
  } catch (error) {
    console.error("Erro ao deletar Arduino:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/usuarios", async (req, res, next) => {
  try {
    const { telefone, senha_hash } = req.body;
    const user = await createUser(telefone, senha_hash);
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res) => {
  const { telefone, senha_hash } = req.body;
  try {
    const userId = await findUser(telefone, senha_hash);
    if (!userId) {
      return res.status(401).json({ error: "Telefone ou senha inválidos" });
    }
    res.json({ id: userId }); 
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.patch("/arduinos/:cod_ard", async (req, res) => {
  try {
    const { cod_ard } = req.params;
    const { usuario_id, horarios } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ error: "usuario_id é obrigatório" });
    }

    const updated = await updateArduino(cod_ard, usuario_id, horarios);

    if (updated) {
      res.json({ message: "Arduino atualizado com sucesso!" });
    } else {
      res.status(404).json({ error: "Arduino não encontrado." });
    }
  } catch (err) {
    console.error("Erro ao atualizar Arduino:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.patch("/arduinos/:cod_ard/:umd", async (req, res) => {
  try {
    const { cod_ard, umd } = req.params; 

    const updated = await pathUmidade(cod_ard, umd);

    if (updated) {
      res.json({ message: "Arduino atualizado com sucesso!" });
    } else {
      res.status(404).json({ error: "Arduino não encontrado." });
    }
  } catch (err) {
    console.error("Erro ao atualizar Arduino:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});




app.use((err, req, res, next) => {
  console.error("🔥 Erro no servidor:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = 8000;


app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.post("/enviar", async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;
    await ContatoWeb(nome, email, mensagem);
    res.send("Mensagem enviada com sucesso 💚");
  } catch (err) {
    console.error("Erro ao salvar mensagem:", err);
    res.status(500).send("Erro ao salvar mensagem 😢");
  }
});


app.use(express.static(path.join(__dirname, "public")));

app.get("/sobre", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sobre.html"));
});

app.get("/infos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "infos.html"));
});

app.get("/contato", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contato.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor Express rodando em http://localhost:${PORT}`);
  console.log(`Servidor Express rodando em https://servidor-632w.onrender.com/home`);
});
