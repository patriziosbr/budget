import { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

function EmailShareList({ 
  emailList = [], 
  onAddEmail, 
  onRemoveEmail, 
  label = "Condividi con (email)" 
}) {
  const [emailToShare, setEmailToShare] = useState('');

  const handleAddEmail = () => {
    if (!emailToShare.trim()) return;

    const email = emailToShare.trim().toLowerCase();
    const alreadyAdded = emailList.some((entry) => entry.email === email);

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
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="email"
            placeholder="user@example.com"
            value={emailToShare}
            onChange={(e) => setEmailToShare(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div 
            role="button" 
            className="d-flex align-items-center border-circle p-2"
            onClick={handleAddEmail}
          >
            <FaPlus />
          </div>
        </div>
      </Form.Group>

      {emailList.length > 0 && (
        <ListGroup className="mb-3">
          {emailList.map((entry, index) => (
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