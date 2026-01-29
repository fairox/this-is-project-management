import { supabase } from "@/integrations/supabase/client";

const rawProjects = [
    {
        name: "Artisan",
        location: "Thetsane, Lesotho",
        type: "Commercial",
        statusDetail: "Completed",
        dbStatus: "completed",
        valueRaw: "M 400 000",
        value: 400000
    },
    {
        name: "Villa Besetsa",
        location: "Masowe 3, Lesotho",
        type: "Residential",
        statusDetail: "Completed",
        dbStatus: "completed",
        valueRaw: "M 1 450 000",
        value: 1450000
    },
    {
        name: "Liberty Stanlib",
        location: "New Europa, Lesotho",
        type: "Commercial",
        statusDetail: "Unbuilt - Covid",
        dbStatus: "on-hold",
        valueRaw: "M 200 500 000",
        value: 200500000
    },
    {
        name: "Villa Likate",
        location: "Thetsane, Lesotho",
        type: "Residential",
        statusDetail: "Design Development",
        dbStatus: "active",
        valueRaw: "M 2 500 000",
        value: 2500000
    },
    {
        name: "Casa Moji",
        location: "Masowe 3, Lesotho",
        type: "Residential",
        statusDetail: "Design Development",
        dbStatus: "active",
        valueRaw: "M 2 100 000",
        value: 2100000
    },
    {
        name: "Qalo Wellness Resort",
        location: "Qalo, Lesotho",
        type: "Commercial",
        statusDetail: "Early Design Stage",
        dbStatus: "active",
        valueRaw: "M 500 000 000",
        value: 500000000
    },
    {
        name: "Lesotho Pavillion (Qatar)",
        location: "Doha, Qatar",
        type: "Exposition Temporary Structure",
        statusDetail: "Unbuilt",
        dbStatus: "on-hold",
        valueRaw: "M 3 500 000",
        value: 3500000
    },
    {
        name: "Lesotho Pavillion (Japan)",
        location: "Okaka, Japan",
        type: "Exposition Temporary Structure",
        statusDetail: "Unbuilt",
        dbStatus: "on-hold",
        valueRaw: "M 3 500 000",
        value: 3500000
    },
    {
        name: "Master Plan Lerotholi Polytechnic",
        location: "Matsoatlareng, Lesotho",
        type: "Institutional", // Inferred
        statusDetail: "Unbuilt - No Funding",
        dbStatus: "on-hold",
        valueRaw: "M 4 000 000 000",
        value: 4000000000
    }
];

export const seedProjects = async () => {
    console.log("Starting project seeding...");

    for (const p of rawProjects) {
        try {
            // 1. Insert Project
            console.log(`Inserting project: ${p.name}`);
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .insert({
                    name: p.name,
                    status: p.dbStatus,
                    description: `Location: ${p.location} | Type: ${p.type} | Stage: ${p.statusDetail}`
                })
                .select()
                .single();

            if (projectError) {
                console.error(`Error inserting project ${p.name}:`, projectError);
                continue;
            }

            if (!projectData) {
                console.error(`No data returned for project ${p.name}`);
                continue;
            }

            // 2. Insert Main Contract (if value mapping exists)
            if (p.value) {
                console.log(`Inserting contract for: ${p.name}`);
                const { error: contractError } = await supabase
                    .from('contracts')
                    .insert({
                        project_id: projectData.id,
                        contract_number: `CTR-${projectData.id.slice(0, 4).toUpperCase()}-001`,
                        title: `Main Contract - ${p.name}`,
                        accepted_contract_amount: p.value,
                        time_for_completion: 365, // Default placeholder
                        status: p.dbStatus === 'completed' ? 'completed' : 'active'
                    });

                if (contractError) {
                    console.error(`Error inserting contract for ${p.name}:`, contractError);
                }
            }

        } catch (e) {
            console.error(`Unexpected error processing ${p.name}:`, e);
        }
    }

    console.log("Seeding completed.");
    alert("Project seeding completed! Check console for details.");
};
