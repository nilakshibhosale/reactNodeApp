import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

let app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get('/api/notes',async(req,res)=>{
    const notes = await prisma.note.findMany();
    res.json(notes);
})
app.post('/api/notes',async(req,res)=>{
    const {title, content} = req.body;

    if(!title || !content){
        return res.status(400).send("Bad request!")
    }

    try{
        const note = await prisma.note.create({
            data:{title,content},
        });
        res.json(note);
    }catch(error){
        res.status(500).send("Oops something went wrong!")
    } 
})

app.put('/api/notes/:id',async(req,res)=>{
    const {title, content} = req.body;
    const id = parseInt(req.params.id);

    if(!id || isNaN(id)){
        return res.status(400).send("proper id is required!")
    }
    if(!title || !content){
        return res.status(400).send("Title and content are required!")
    }
    try{
        const updateNote = await prisma.note.update({
            where:{id},
            data:{title,content},
        })
        res.json(updateNote);
    }catch(error){
        res.status(500).send("Oops something went wrong!")
    }
})

app.delete('/api/notes/:id',async(req,res)=>{
    const id = parseInt(req.params.id);

    if(!id || isNaN(id)){
        return res.status(400).send("proper id is required!")
    }
    
    try{
        await prisma.note.delete({
            where:{id}
        })
        res.status(204).send()
    }catch(error){
        res.status(500).send("Oops something went wrong!")
    }
})
app.listen(5000,()=>{
    console.log("server is listening to port")
});