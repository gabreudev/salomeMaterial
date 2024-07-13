import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; cpf?: string; email?: string; confirmEmail?: string }>({});
  const [message, setMessage] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pixCopiaECola, setPixCopiaECola] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    document.title = 'SalomeStudies';

    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = `./favicon.ico`;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.id = 'favicon';
      newFavicon.rel = 'icon';
      newFavicon.href = `./favicon.ico`;
      document.head.appendChild(newFavicon);
    }
  }, []);

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const endPageRef = useRef<HTMLDivElement>(null);

  interface User {
    nome: string;
    email: string;
    cpf: string;
  }

  const API_URL = 'https://salomematerial-api.azurewebsites.net';

  const validateName = (name: string) => {
    if (!name) {
      return 'Nome é obrigatório';
    }
    return '';
  };

  const validateCpf = (cpf: string) => {
    if (!cpf) {
      return 'CPF é obrigatório';
    }
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
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

  const generateCharge = async (data: User) => {
    try {
      const response = await axios.post(API_URL + '/api/v1/pix', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Erro ${error.response.status}: ${error.response.data.error_description}`);
        } else {
          throw new Error(`Erro de requisição: ${error.message}`);
        }
      } else {
        throw new Error('Erro desconhecido ao gerar cobrança Pix');
      }
    }
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
    setQrCode(null);
    setPixCopiaECola(null);
    setLoading(true); 

    const sanitizedCpf = cpf.replace(/\D/g, '');

    try {
      const userData: User = { nome: name, email: email, cpf: sanitizedCpf };
      const responseData = await generateCharge(userData);
      setPixCopiaECola(responseData.pixCopiaECola);
      setQrCode(`data:image/png;base64,${responseData.imagemQrcode}`);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Erro desconhecido ao gerar cobrança Pix');
      }
    } finally {
      setLoading(false); 
    }
  };

  const copyToClipboard = () => {
    if (pixCopiaECola) {
      navigator.clipboard.writeText(pixCopiaECola);
      alert('Código Copia e Cola copiado para a área de transferência!');
    }
  };

  useEffect(() => {
    if (qrCodeRef.current && qrCode) {
      endPageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qrCode]);

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        {/* Vídeo do YouTube */}
        <div className="row justify-content-center">
          <iframe
            className="video"
            src="https://www.youtube.com/embed/PetwcWjT-go"
            allowFullScreen
            title="Apostilha"
          ></iframe>
        </div>

        {/* Formulário de Contato */}
        <div className="container py-5 equal-width">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-title position-relative text-center mb-5 pb-2">
                <a
                  href="https://www.instagram.com/salomestudies?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  className="position-relative d-inline text-primary ps-4 text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @SalomeStudies
                </a>
                <h2 className="mt-2 titulo">Faça o pagamento e adquira já o seu guia da redação</h2>
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
                          type="text"
                          className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                          id="cpf"
                          placeholder="Seu CPF"
                          value={cpf}
                          onChange={handleCpfChange}
                        />
                        <label htmlFor="cpf">Seu CPF</label>
                        {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="email"
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
                    <div className="lista">
                      <h6>Informações sobre o pagamento PIX:</h6>
                      <ul>
                        <li>Valor do pagamento <strong>R$ 4,90</strong>.</li>
                        <li>O Material será enviado no email informado.</li>
                        <li>Envio imediato!</li>
                        <li>Após clicar em pagar, espere até que a cobrança seja gerada e escaneie o QRcode ou copie o código gerado.</li>
                      </ul>
                    </div>
                    <div className="col-12">
                      <button className="botao-pagar btn w-100 py-3" type="submit" disabled={loading}>
                        {loading ? 'Gerando cobrança...' : 'Pagar agora'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {message && <p className="message">{message}</p>}
              {loading && (
                <div className="d-flex justify-content-center mt-3">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              {qrCode && (
                <div className="card mt-4 shadow-sm" ref={qrCodeRef}>
                  <div className="card-body text-center">
                    <p className="card-text">Escaneie o QR Code abaixo ou copie o código para efetuar o pagamento:</p>
                    <img src={qrCode} alt="QR Code" className="img-fluid mb-3" />
                    {pixCopiaECola && (
                      <>
                        <div className="d-flex flex-column align-items-center">
                          <button className="btn btn-secondary mb-3" onClick={copyToClipboard}>Copiar código copia e cola</button>
                          <p className="text-muted">Você tem um prazo de 24 horas para efetuar o pagamento. Após esse período, a cobrança será invalidada.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div ref={endPageRef}>
          <h6 className='suporte'>suporte: suporte.salome@gmail.com</h6>
        </div>
      </div>
    </>
  );
};

export default App;
