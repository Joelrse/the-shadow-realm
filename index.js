document.addEventListener('DOMContentLoaded', () => {
    const agentsContainer = document.querySelector("#agents")
    const searchBar = document.querySelector("#searchBar")
    let agentsData = []

    
    const getAgents = () => {
        fetch("https://valorant-api.com/v1/agents")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText)
                }
                return response.json()
            })
            .then(data => {
                agentsData = data.data.filter(agent => agent.isPlayableCharacter)
                renderAgents(agentsData);
            })
            .catch(error => console.error(error))
    }

    
    const renderAgents = (agents) => {
        agentsContainer.innerHTML = ''

        agents.forEach(agent => {
            const agentContainer = document.createElement("div")
            agentContainer.className = 'agent-container'

            const nameLabel = document.createElement("div")
            nameLabel.className = 'agent-name'
            nameLabel.textContent = agent.displayName

            const displayAgent = document.createElement("img")
            displayAgent.src = agent.bustPortrait 
            displayAgent.dataset.displayName = agent.displayName
            displayAgent.dataset.description = agent.description
            displayAgent.alt = agent.displayName
            displayAgent.className = 'agent-image'

            const tooltip = document.createElement("div")
            tooltip.className = 'tooltip'
            tooltip.textContent = getAbilityNames(agent.abilities)
            tooltip.style.display = 'none'

            const detailedView = document.createElement("div")
            detailedView.className = 'detailed-view'
            detailedView.innerHTML = getDetailedAbilities(agent.abilities)
            detailedView.style.display = 'none'

            agentContainer.appendChild(nameLabel)
            agentContainer.appendChild(displayAgent)
            agentContainer.appendChild(tooltip)
            agentContainer.appendChild(detailedView)
            agentsContainer.appendChild(agentContainer)

            displayAgent.addEventListener('mouseover', () => {
                tooltip.style.display = 'block'
            });

            displayAgent.addEventListener('mouseout', () => {
                tooltip.style.display = 'none'
            });

           

            displayAgent.addEventListener('click', () => {
                const isDetailedVisible = detailedView.style.display === 'block'
                document.querySelectorAll('.detailed-view').forEach(dv => dv.style.display = 'none')
                detailedView.style.display = isDetailedVisible ? 'none' : 'block'
            })
        })
    }

    
    const getAbilityNames = (abilities) => {
        if (!abilities) return ''
        return abilities.map(ability => ability.displayName).join(', ')
    }

    
    const getDetailedAbilities = (abilities) => {
        if (!abilities) return '<p>No abilities available.</p>'
        return abilities.map(ability => `
            <div class="ability-detail">
                <h4>${ability.displayName}</h4>
                <p>${ability.description}</p>
            </div>
        `).join('')
    };

    
    const handleSearch = () => {
        const query = searchBar.value.toLowerCase()
        const filteredAgents = agentsData.filter(agent =>
            agent.displayName.toLowerCase().includes(query)
        )
        renderAgents(filteredAgents)
    }

    
    if (searchBar) {
        searchBar.addEventListener('input', handleSearch)
    } else {
        console.error('Search bar not found!')
    }

    
    getAgents()
})
