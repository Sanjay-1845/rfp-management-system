exports.buildRFPEmail = (rfp) => {
    const itemsHtml = (rfp.structured.items || [])
      .map(
        item => `
          <li>
            ${item.name} — Qty: ${item.quantity}
            ${item.specifications ? `(${JSON.stringify(item.specifications)})` : ''}
          </li>
        `
      )
      .join('');
  
    return `
      <h2>Request for Proposal (${rfp.rfpId})</h2>  
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
  
      <h3>Budget</h3>
      <p>
        ${rfp.structured.budget?.amount || 'N/A'}
        ${rfp.structured.budget?.currency || ''}
      </p>
  
      <h3>Constraints</h3>
      <ul>
        <li>Delivery: ${rfp.structured.constraints?.deliveryDays || 'N/A'} days</li>
        <li>Payment: ${rfp.structured.constraints?.paymentTerms || 'N/A'}</li>
        <li>Warranty: ${rfp.structured.constraints?.warranty || 'N/A'}</li>
      </ul>
    `;
  };
  