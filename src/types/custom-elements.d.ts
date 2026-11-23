import 'react';

type CustomElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  class?: string;
  className?: string;
  [key: string]: any;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'sticky-header': CustomElementProps;
      'burger-menu': CustomElementProps;
      'header-search': CustomElementProps;
      'predictive-search': CustomElementProps;
      'cart-drawer': CustomElementProps;
      'cart-drawer-items': CustomElementProps;
      'product-form': CustomElementProps;
      'product-card': CustomElementProps;
      'quantity-input': CustomElementProps;
      'modal-opener': CustomElementProps;
      'modal-dialog': CustomElementProps;
      'slideshow-component': CustomElementProps;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sticky-header': CustomElementProps;
      'burger-menu': CustomElementProps;
      'header-search': CustomElementProps;
      'predictive-search': CustomElementProps;
      'cart-drawer': CustomElementProps;
      'cart-drawer-items': CustomElementProps;
      'product-form': CustomElementProps;
      'product-card': CustomElementProps;
      'quantity-input': CustomElementProps;
      'modal-opener': CustomElementProps;
      'modal-dialog': CustomElementProps;
      'slideshow-component': CustomElementProps;
    }
  }
}
