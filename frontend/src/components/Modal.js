import React from 'react'
import { createPortal } from 'react-dom';

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '50px',
    color: 'white',
    fontSize: 31
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)'
}

export default function Modal({isOpen, children}) {
    if (!isOpen) {
        return null
    };
  return createPortal(
    <>
        <div style={OVERLAY_STYLES}></div>
        <div style={MODAL_STYLES}>
            {children}
        </div>
    </>,
    document.getElementById('portal')
  )
}
