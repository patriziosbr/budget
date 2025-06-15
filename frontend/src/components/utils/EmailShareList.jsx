import { useEffect, useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

function EmailShareList({ 
  emailList_tmp = [], 
  onAddEmail,
  onValidateEmail, 
  onRemoveEmail,
  emailListParent= [],
  label = "Condividi con (email)" 
}) {
  const [emailToShare, setEmailToShare] = useState('');

  const handleAddEmail = () => {
    if (!emailToShare.trim()) return;

    const email = emailToShare.trim().toLowerCase();
    if(!onValidateEmail(email)) {toast.warn('Inserisci un indirizzo email valido'); return};
    const alreadyAdded = emailList_tmp.some((entry) => entry.email === email) || emailListParent.some((m) => m.email === email);
    if (alreadyAdded) {
      toast.warn('Email già aggiunta');
      return;
    }

    onAddEmail({ email, role: 'write' });
    setEmailToShare('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };
  

  return (
    <>

      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <div  className="d-flex align-items-center gap-2">
          <Form.Control
            type="email"
            placeholder="user@example.com"
            value={emailToShare}
            onChange={(e) => setEmailToShare(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            role="button" 
            style={{'border': "3px solid #0d6efd" }}
            className="d-flex align-items-center border-circle p-2"
            onClick={handleAddEmail}
          >
          <FaPlus />
          </Button>
        </div>
      </Form.Group>

      {emailList_tmp.length > 0 && (
        <ListGroup className="mb-3">
          {emailList_tmp.map((entry, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {entry.email}
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => onRemoveEmail(entry.email)}
              >
                Rimuovi
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}

export default EmailShareList;