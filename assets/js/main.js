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
        <span class="name">${pokemon.name}</span>
      </button>
      <div class="detail">
        <ol class="types">
          ${pokemon.types
            .map((type) => `<li class="type ${type}">${type}</li>`)
            .join("")}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `;
}

function loadPokemonItems(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNextPage = offset + limit;

  if (qtdRecordsWithNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItems(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItems(offset, limit);
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

    dialog.innerHTML = `
      <button type="button" class="btnBack" onclick="closeModal()">&#129044;</button>
      <div>
        <span class="number">#${pokemonData.id}</span>
        <span class="name">${pokemonData.name}</span>
      </div>
      <div class="img">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        pokemonData.id
      }.png" alt="${pokemonData.name}">
    </div>
    
      <div class="info">
        <h3>Weight</h3><p class="weight">${pokemonData.weight / 10} kg</p>
        <h3>Height</h3><p class="height">${pokemonData.height / 10} m</p>
        <h3>Abilities</h3><p class="abilities">${pokemonData.abilities
          .map((ability) => ability.ability.name)
          .join(" | ")}</p>
        <h3>Stats</h3>
        <ul class="stats">
          ${pokemonData.stats
            .map(
              (stat) =>
                `<li class="${pokemonData.types[0].type.name}">${stat.stat.name}: ${stat.base_stat}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    dialog.classList.add(pokemonData.types[0].type.name);

    // Adicione o evento 'load' para mostrar o dialog após o conteúdo ter sido carregado
    dialog.addEventListener("load", function () {
      dialog.showModal();
    });
  } catch (error) {
    console.error(error);
  }
}

function closeModal() {
  dialog.close();
  dialog.classList.remove(...dialog.classList);
}

pokemonList.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("name")) {
    dialog.showModal();
  }
});

dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    closeModal();
  }
});
