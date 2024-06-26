import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; cpf?: string; email?: string; confirmEmail?: string }>({});
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

  const validateConfirmEmail = (email: string, confirmEmail: string) => {
    if (email !== confirmEmail) {
      return 'Emails não coincidem';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(name);
    const cpfError = validateCpf(cpf);
    const emailError = validateEmail(email);
    const confirmEmailError = validateConfirmEmail(email, confirmEmail);

    if (nameError || cpfError || emailError || confirmEmailError) {
      setErrors({ name: nameError, cpf: cpfError, email: emailError, confirmEmail: confirmEmailError });
      return;
    }

    setErrors({});
    setMessage('');

    try {
      // Simulação de envio de formulário (substituir com sua lógica real)
      setMessage('Mensagem enviada com sucesso!');
    } catch (error) {
      setMessage('Erro ao enviar mensagem.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Hero section */}
      <div className="bg-primary flex-grow-1">
        <div className="container my-5 py-5 px-lg-5">
          <div className="row g-5 py-5">
            <div className="col-12 text-center">
              <h1 className="text-white">Imagem ilustrativa do material</h1>
              <hr className="bg-white mx-auto mt-0" style={{ width: '50px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Contato */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="section-title position-relative text-center mb-5 pb-2">
              <h6 className="position-relative d-inline text-primary ps-4">SalomeStudies</h6>
              <h2 className="mt-2">Faça o pagamento e adquira já o seu material</h2>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        placeholder="Seu Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label htmlFor="name">Seu Nome</label>
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="cpf"
                        className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                        id="cpf"
                        placeholder="Seu Email"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                      />
                      <label htmlFor="cpf">Seu CPF</label>
                      {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="seuemail@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label htmlFor="email">Email</label>
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="email"
                        className={`form-control ${errors.confirmEmail ? 'is-invalid' : ''}`}
                        id="confirmEmail"
                        placeholder="Confirmar Email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                      />
                      <label htmlFor="confirmEmail">Confirmar Email</label>
                      {errors.confirmEmail && <div className="invalid-feedback">{errors.confirmEmail}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100 py-3" type="submit">Pagar agora</button>
                  </div>
                </div>
              </form>
            </div>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default App;
