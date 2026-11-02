'use client';
import { useEffect, useRef } from 'react';
import './app.css';
import { MARCACAO } from './marcacao';
import { iniciar } from '@/motor/motor';

export default function AppCliente({ conteudo }) {
  const arrancou = useRef(false);
  useEffect(() => {
    if (arrancou.current) return;
    arrancou.current = true;
    iniciar(conteudo);
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, [conteudo]);
  return <div id="raiz" dangerouslySetInnerHTML={{ __html: MARCACAO }} />;
}
