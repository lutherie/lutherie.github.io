<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeAl_nj88Q5SDYP5tPeqoAu447wEMZh_cuxOeVMu-aVTzYvmw/viewform?usp=pp_url&entry.200953110=1&embedded=true" width="100%" height="2020" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>

### Paiement par carte bancaire
<ul>
  <li>
    <button id="checkout-button-240" role="link">Traité de Lutherie + PDF (240€)</button>
  </li>
  <li>
    <button id="checkout-button-225" role="link">Traité de Lutherie (225€)</button>
  </li>
</ul>

### Paiement avec paypal
  - [Traité de Lutherie + PDF (240€)](https://www.paypal.me/traitedelutherie/240)
  - [Traité de Lutherie (225€)](https://www.paypal.me/traitedelutherie/225)

### Paiement par virement

```
IBAN FR76 3000 4002 4300 0103 5805 671
BIC BNPAFRPPXXX

BNP PARIS AS BREST
```

### Paiement par chèque (à l'ordre de ALADFI)
Adresse postale:

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

