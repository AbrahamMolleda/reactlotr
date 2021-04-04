import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
//import { getQueriesForElement } from '@testing-library/dom';

function App() {
  const baseUrl = "https://localhost:5001/personajes";
  const [data, setData]=useState([]);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [personajeSeleccionado, setPersonajeSeleccionado]=useState({
    idPersonaje: '',
    nombre: '',
    raza: '',
    edad: ''
  });

  const handleChange=e=>{
    const{name, value}=e.target;
    setPersonajeSeleccionado({
      ...personajeSeleccionado,
      [name]: value
    });
    console.log(personajeSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }
  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    });
  }

  const peticionPost=async()=>{
    delete personajeSeleccionado.idPersonaje;
    personajeSeleccionado.edad=parseInt(personajeSeleccionado.edad);
    await axios.post(baseUrl, personajeSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    });
  }

  useEffect(() => {
    peticionGet();
  }, []);

  const peticionPut=async()=>{
    personajeSeleccionado.edad=parseInt(personajeSeleccionado.edad);
    await axios.put(baseUrl+"/"+personajeSeleccionado.idPersonaje, personajeSeleccionado)
    .then(response=>{
      var respuesta = response.data;
      var dataaux = data;
      dataaux.map(personaje=>{
        if(personaje.idPersonaje===personajeSeleccionado.idPersonaje){
          personaje.nombre = respuesta.nombre;
          personaje.raza = respuesta.raza;
          personaje.edad = respuesta.edad;
        }
      });
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    });
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+personajeSeleccionado.idPersonaje)
    .then(response=>{
      setData(data.filter(personaje=>personaje.idPersonaje!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    });
  }

  const seleccionarPersonaje=(personaje, caso)=>{
    setPersonajeSeleccionado(personaje);
    (caso==="Editar")?
    abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  }

  return (
    <div className="App">
      <br/>
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Agregar Personaje</button>
      <table className="table table-bordered">
        <thead>
          <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Raza</th>
          <th>Edad</th>
          <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(personaje=>(
            <tr key={personaje.idPersonaje}>
              <td>{personaje.idPersonaje}</td>
              <td>{personaje.nombre}</td>
              <td>{personaje.raza}</td>
              <td>{personaje.edad}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarPersonaje(personaje, "Editar")}>Editar</button>
                <button className="btn btn-danger" onClick={()=>seleccionarPersonaje(personaje, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Nuevo Personaje</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br/>
            <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
            <br/>
            <label>Raza: </label>
            <br/>
            <input type="text" className="form-control" name="raza" onChange={handleChange}/>
            <br/>
            <label>Edad: </label>
            <br/>
            <input type="text" className="form-control" name="edad" onChange={handleChange}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button> {" "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Nuevo Personaje</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id: </label>
            <br/>
            <input type="text" className="form-control" readOnly value={personajeSeleccionado && personajeSeleccionado.idPersonaje}/>
            <br/>
            <label>Nombre: </label>
            <br/>
            <input type="text" className="form-control" name="nombre" onChange={handleChange} value={personajeSeleccionado && personajeSeleccionado.nombre}/>
            <br/>
            <label>Raza: </label>
            <br/>
            <input type="text" className="form-control" name="raza" onChange={handleChange} value={personajeSeleccionado && personajeSeleccionado.raza}/>
            <br/>
            <label>Edad: </label>
            <br/>
            <input type="text" className="form-control" name="edad" onChange={handleChange} value={personajeSeleccionado && personajeSeleccionado.edad}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button> {" "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Estas seguro {personajeSeleccionado && personajeSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>Si</button>
          <button className="btn btn-primary" onClick={()=>abrirCerrarModalEliminar()}>No</button> {" "}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;