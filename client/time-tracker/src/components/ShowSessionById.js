import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/showSession.module.css'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from 'react-router-dom';

const ShowSessionById = () => {
    const [session, setSession] = React.useState({})
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:5000/getById/${id}`)
            .then(res => res.json())
            .then(data => {
                setSession(data[0])

            })
    }, [])

    return (

        <div className={styles.main}>
            <Link to="/">  <KeyboardBackspaceIcon /></Link>
            <p>Date  <span className={styles.a}>{session.sessionDate}</span></p>
            <p>Session time <span className={styles.b}> {session.hour}hr {session.minute}min</span></p>
        </div>
    );
};

export default ShowSessionById;