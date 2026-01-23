export async function fetchClients() {
    const response = await fetch('https://api.unicornio.tech/clients');
    if (!response.ok) {
      throw new Error('Error al obtener los clientes');
    }
    return response.json();
  }