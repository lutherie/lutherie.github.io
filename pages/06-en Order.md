<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeAl_nj88Q5SDYP5tPeqoAu447wEMZh_cuxOeVMu-aVTzYvmw/viewform?usp=pp_url&entry.200953110=1&embedded=true" width="100%" height="2006" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>

### Pay with card
<ul>
  <li>
    <button id="checkout-button-230" role="link">Traiter de Lutherie + PDF (230€)</button>
  </li>
  <li>
    <button id="checkout-button-215" role="link">Traiter de Lutherie (215€)</button>
  </li>
</ul>

### Pay with paypal
  - [Traiter de Lutherie + PDF (230€)](https://www.paypal.me/traitedelutherie/230)
  - [Traiter de Lutherie (215€)](https://www.paypal.me/traitedelutherie/215)

### Bank Transfert

```
IBAN FR76 3000 00243 00010358056 71
BIC BNPAFRPPXXX

BNP PARIS AS BREST
```

### Bank Check (payable to ALADFI)
Postal address:

```
Mme elodie EGRET - Aladfi ed.
8 Rue Boussingault
Elodie Egret
29200 Brest
FRANCE 
```

<!-- Load Stripe.js on your website. -->
<script src="https://js.stripe.com/v3"></script>
<script>
var stripe = Stripe('pk_live_nDnMEpVdsNCRVfAi6gVPU2rk00B57X8hyQ', {
  betas: ['checkout_beta_4']
})

function setStripe(id, items) {
  document.getElementById(id).addEventListener('click', function () {
    stripe.redirectToCheckout({
      items: items,
      successUrl: 'https://traitedelutherie.com/success',
      cancelUrl: 'https://traitedelutherie.com/canceled',
    })
    .then(function (result) {
      if (result.error) {
        var displayError = document.getElementById('error-message')
        displayError.textContent = result.error.message
      }
    })
  })
}

setStripe('checkout-button-230', [
  {sku: 'sku_EnciNWzNmYYbh8', quantity: 1},
  {sku: 'sku_EnclvkJ8hiu8Iz', quantity: 1},
])

setStripe('checkout-button-215', [
  {sku: 'sku_EnciNWzNmYYbh8', quantity: 1},
])

</script>
