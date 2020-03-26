import React, { useState, useEffect } from 'react';

import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';

import api from '../../services/api';

import './style.css'

export default function Profile() { 
    const[incidents, setIncidents] = useState([]);

    const history = useHistory();

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => { 
            setIncidents(response.data);
        })
    }, [ongId]) 

    async function handleDeleteIncident(id) {
       try {
           await api.delete(`incidents/${id}`, {
               headers: { 
                   Authorization: ongId,
               }
           });

           setIncidents(incidents.filter(incident => incident.id !== id));
           //Para cada um dos incidentes, manter apenas o que for diferente do delete

        } catch (err) {
            alert('Erro ao deletar caso, tente novamente')
        }
    }

    function handleLogout() {

        localStorage.clear();

        history.push('/');
    }

    /**
     * Serve pra disparar alguma func em determinado momento do componente
     * recebe dois parâmetros -> função a ser executada, quando ela será executada
     */

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
                <span>Bem vinda, {ongName}</span>

                <Link to="/incidents/new" className="button">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
               {incidents.map(incident => (
                <li key={incident.id}>

                    ID: {incident.id}
                    <br />
                    
                    <strong>Caso:</strong>
                    <p>{incident.title}</p>

                    <strong>Descrição:</strong>
                    <p>{incident.description}</p>

                    <strong>Valor:</strong>
                    <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                    <button onClick={ () => handleDeleteIncident(incident.id) } type="button"> 
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
               ))}
            </ul>

        </div>
    );
}