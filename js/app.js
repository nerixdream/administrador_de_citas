//Variables de inputs
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//variables de UI
const formulario = document.querySelector('#nueva-cita');
const listaCitas = document.querySelector('#citas');

let editando;

// Clases

class Citas {
	constructor() {
		this.citas = [];
	}

	//Agrega los objectos al arreglo
	agregarCitas(cita) {
		this.citas = [...this.citas, cita];

		// console.log(this.citas);
	}

	//Elimina una cita del arreglo
	eliminarCita(id) {
		this.citas = this.citas.filter((cita) => cita.id !== id);
	}

	//Edita una cita
	editarCita(citaActualizada) {
		this.citas = this.citas.map((cita) => (cita.id === citaActualizada.id ? citaActualizada : cita));
	}
}

class UI {
	mostrarMensaje(mensaje, tipo) {
		const divMensaje = document.createElement('div');
		divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

		if (tipo === 'error') {
			divMensaje.classList.add('alert-danger');
		} else {
			divMensaje.classList.add('alert-success');
		}

		//Agregamos mensaje
		divMensaje.textContent = mensaje;

		//Agregamos al DOM
		document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

		//Quitamos mensaje
		setTimeout(() => {
			divMensaje.remove();
		}, 3000);
	}

	imprimirCita({ citas }) {
		//destructuracion
		this.limpiarHTML();

		citas.forEach((cita) => {
			const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

			//Crea el div para la cita
			const divCita = document.createElement('div');
			divCita.classList.add('cita', 'p-3');
			divCita.dataset.id = id;

			//Scripting de los elementos
			const mascotaParrafo = document.createElement('h2');
			mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
			mascotaParrafo.textContent = mascota;

			const propietarioParrafo = document.createElement('p');
			propietarioParrafo.innerHTML = `
				<span class="font-weight-bolder">Propietario:</span> ${propietario}
			`;

			const telefonoParrafo = document.createElement('p');
			telefonoParrafo.innerHTML = `
				<span class="font-weight-bolder">Telefono:</span> ${telefono}
			`;

			const fechaParrafo = document.createElement('p');
			fechaParrafo.innerHTML = `
				<span class="font-weight-bolder">Fecha:</span> ${fecha}
			`;

			const horaParrafo = document.createElement('p');
			horaParrafo.innerHTML = `
				<span class="font-weight-bolder">Hora:</span> ${hora}
			`;

			const sintomasParrafo = document.createElement('p');
			sintomasParrafo.innerHTML = `
				<span class="font-weight-bolder">Sintomas:</span> ${sintomas}
			`;

			//Agrega boton de eliminar
			const btnEliminar = document.createElement('button');
			btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
			btnEliminar.textContent = 'Eliminar';

			//Agrega funcionalidad al boton de eliminar cita
			btnEliminar.onclick = () => eliminarCita(id);

			//Agrega boton de editar
			const btnEditar = document.createElement('button');
			btnEditar.classList.add('btn', 'btn-info', 'mr-2');
			btnEditar.textContent = 'Editar';

			//Agrega funcionalidad al boton de editar cita
			btnEditar.onclick = () => editarCita(cita);

			//agrega al div de cita
			divCita.appendChild(mascotaParrafo);
			divCita.appendChild(propietarioParrafo);
			divCita.appendChild(telefonoParrafo);
			divCita.appendChild(fechaParrafo);
			divCita.appendChild(horaParrafo);
			divCita.appendChild(sintomasParrafo);
			divCita.appendChild(btnEliminar);
			divCita.appendChild(btnEditar);

			// agrega al contenedor de citas
			listaCitas.appendChild(divCita);
		});
	}

	limpiarHTML() {
		while (listaCitas.firstChild) {
			listaCitas.removeChild(listaCitas.firstChild);
		}
	}
}

const adminCitas = new Citas();
const ui = new UI();

//EventListeners
eventListeners();
function eventListeners() {
	mascotaInput.addEventListener('input', datosCita);
	propietarioInput.addEventListener('input', datosCita);
	telefonoInput.addEventListener('input', datosCita);
	fechaInput.addEventListener('input', datosCita);
	horaInput.addEventListener('input', datosCita);
	sintomasInput.addEventListener('input', datosCita);

	formulario.addEventListener('submit', nuevaCita);
}

//Objecto con los datos
let datosObj = {
	mascota: '',
	propietario: '',
	telefono: '',
	fecha: '',
	hora: '',
	sintomas: '',
};

//Funciones
//Agrega los datos al objecto
function datosCita(e) {
	datosObj[e.target.name] = e.target.value;
}

//Valida y agrega una nueva cita
function nuevaCita(e) {
	e.preventDefault();
	const { mascota, propietario, telefono, fecha, hora, sintomas } = datosObj;

	if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
		ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
		return;
	}

	if (editando) {
		//Mensaje de cita editada
		ui.mostrarMensaje('Cita editada correctamente');

		//Pasar los datos al objeto
		adminCitas.editarCita({ ...datosObj });

		document.querySelector('button[type="submit"]').textContent = 'Crear Cita';

		editando = false;
	} else {
		//Agragar id
		datosObj.id = Date.now();

		//Agregar cita
		adminCitas.agregarCitas({ ...datosObj });

		//Mensaje de cita agregada
		ui.mostrarMensaje('Cita agregada correctamente');
	}

	//Reinicia el objecto
	reiniciarObj();

	//Reinicia el formulario
	formulario.reset();

	//imprimir cita
	ui.imprimirCita(adminCitas);
}

function reiniciarObj() {
	datosObj.mascota = '';
	datosObj.propietario = '';
	datosObj.telefono = '';
	datosObj.fecha = '';
	datosObj.hora = '';
	datosObj.sintomas = '';
}

function eliminarCita(id) {
	//Eliminar la cita del arreglo
	adminCitas.eliminarCita(id);

	//Mostrar un mensaje
	ui.mostrarMensaje('La cita se eliminó correctamente');

	//Actualizar la lista de citas
	ui.imprimirCita(adminCitas);
}

function editarCita(cita) {
	const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

	//Llenar los input
	mascotaInput.value = mascota;
	propietarioInput.value = propietario;
	telefonoInput.value = telefono;
	fechaInput.value = fecha;
	horaInput.value = hora;
	sintomasInput.value = sintomas;

	//Llena el objeto
	datosObj.mascota = mascota;
	datosObj.propietario = propietario;
	datosObj.telefono = telefono;
	datosObj.fecha = fecha;
	datosObj.hora = hora;
	datosObj.sintomas = sintomas;
	datosObj.id = id;

	//Cambia texto del boton
	document.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

	editando = true;
}
