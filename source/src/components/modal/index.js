import { h } from 'preact';

export const Modal = ({ onClose, title, children }) => {
  return (
    <div class="modal">
      <div class="modal-content">
        <header class="modal-header">
          <h5>{title}</h5>
          <a class="close" onClick={onClose}>
            x
          </a>
        </header>
        { children }
      </div>
    </div>
  );
};

export const ModalBody = ({ children }) => {
  return (
    <section class="modal-body">
      { children }
    </section>
  );
};

export const ModalFooter = ({ children }) => {
  return (
    <footer class="modal-footer">
      { children }
    </footer>
  );
};
