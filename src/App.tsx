// src/App.tsx

import React, { useState } from 'react';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; cpf?: string; email?: string }>({});
  const [message, setMessage] = useState('');

  const validateName = (name: string) => {
    if (!name) {
      return 'Nome é obrigatório';
    }
    return '';
  };

  const validateCpf = (cpf: string) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpf) {
      return 'CPF é obrigatório';
    }
    if (!cpfRegex.test(cpf)) {
      return 'CPF inválido';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email é obrigatório';
    }
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(name);
    const cpfError = validateCpf(cpf);
    const emailError = validateEmail(email);

    if (nameError || cpfError || emailError) {
      setErrors({ name: nameError, cpf: cpfError, email: emailError });
      return;
    }

    setErrors({});
    setMessage('');

    try {
      const response = await fetch('https://your-backend-url.com/api/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, cpf, email }),
      });

      if (response.ok) {
        setMessage('Pix gerado com sucesso!');
      } else {
        setMessage('Erro ao gerar Pix.');
      }
    } catch (error) {
      setMessage('Erro ao conectar ao backend.');
    }
  };

  return (
    <div>
      <h1>Gerar Pix</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div>
          <label>
            CPF:
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="123.456.789-10"
            />
          </label>
          {errors.cpf && <span>{errors.cpf}</span>}
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {errors.email && <span>{errors.email}</span>}
        </div>
        <button type="submit">Gerar Pix</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;
