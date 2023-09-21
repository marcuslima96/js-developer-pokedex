const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const dialog = document.getElementById("dialog");

const maxRecords = 151;
const limit = 12;
let offset = 0;

let pokeList = [];

function convertPokemonToLi(pokemon) {
  return `

        <li class="pokemon ${pokemon.type}">
            
        <span class="number">${pokemon.number}</span>
        <button class="btn-pokemon" onClick="pokemonModal(${pokemon.number})">
            <span class="name" >${pokemon.name}</span>
            </button>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    // pokeList = [...pokeList, ...pokemons];
    // pokeList.push(pokemons);
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

// MODAL
async function pokemonModal(id) {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("Não foi possível buscar os dados do Pokémon.");
    }

    let pokemonData = await response.json();
    const dialog = document.getElementById("dialog");

    dialog.innerHTML = "";

    dialog.innerHTML = `<button type="button" class="btnBack" onclick="closeModal()">
            x
            </button>
            <div>
            <span class="number">#${pokemonData.id}</span>
            <span class="name">${pokemonData.name}</span>
            </div>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png" alt="${pokemonData.name}">
           `;

    const types = pokemonData.types.map((type) => type.type.name);
    let typesList = "";

    if (types.length > 0) {
      typesList += `<ol class="types">`;
      types.forEach((typeName) => {
        typesList += `<li class="type ${typeName}">${typeName}</li>`;
      });
      typesList += `</ol>`;
    } else {
      typesList = `<p class="type">Tipo(s): Desconhecido</p>`;
    }

    dialog.innerHTML += typesList;
    const abilities = pokemonData.abilities
      .map((ability) => ability.ability.name)
      .join(" | ");

    dialog.innerHTML += `
      <div class="info">
        <h3>Weight</h3><p class="weight">${pokemonData.weight / 10} kg</p>
        <h3>Height</h3><p class="height">${pokemonData.height / 10} m</p>
        <h3>Abilities</h3><p class="abilities">${abilities}</p>
      </div>
    `;

    console.log(pokemonData);
  } catch (error) {
    console.error(error);
  }
}

function closeModal() {
  const dialog = document.getElementById("dialog");
  dialog.close();
}

pokemonList.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("name")) {
    dialog.showModal();
  }
  console.log(dialog);
});

dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    closeModal();
  }
});
