import { calculateDeliveryFee } from "@/core/delivery";
import { getTenant } from "@/tenants";

export const runtime = "nodejs";

type CepLocation = {
  cep: string;
  state: string;
  city: string;
  neighborhood?: string;
  street?: string;
  location?: {
    coordinates?: {
      longitude?: string;
      latitude?: string;
    };
  };
};

type RouteResponse = {
  code?: string;
  routes?: Array<{
    distance?: number;
    duration?: number;
  }>;
};

function cleanCep(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

async function geocodeCep(cep: string): Promise<CepLocation> {
  const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "CommerceOS/0.1 delivery-quote",
    },
    next: { revalidate: 86_400 },
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error("CEP não encontrado.");
  }

  return response.json() as Promise<CepLocation>;
}

function coordinatesOf(location: CepLocation): [number, number] {
  const longitude = Number(location.location?.coordinates?.longitude);
  const latitude = Number(location.location?.coordinates?.latitude);

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    throw new Error("Não foi possível localizar este CEP.");
  }

  return [longitude, latitude];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { cep?: string };
    const destinationCep = cleanCep(body.cep);

    if (destinationCep.length !== 8) {
      return Response.json(
        { error: "Informe um CEP válido com 8 números." },
        { status: 400 },
      );
    }

    const tenant = getTenant();
    const originCep = cleanCep(tenant.operation.deliveryPricing.origin.cep);

    const [origin, destination] = await Promise.all([
      geocodeCep(originCep),
      geocodeCep(destinationCep),
    ]);

    if (
      destination.city.toLocaleLowerCase("pt-BR") !==
        tenant.contact.city.toLocaleLowerCase("pt-BR") ||
      destination.state.toUpperCase() !== tenant.contact.region.toUpperCase()
    ) {
      return Response.json(
        {
          error: `Nesta fase, a entrega automática está disponível somente em ${tenant.contact.city}.`,
        },
        { status: 422 },
      );
    }

    const [originLongitude, originLatitude] = coordinatesOf(origin);
    const [destinationLongitude, destinationLatitude] = coordinatesOf(destination);

    const routeUrl =
      "https://router.project-osrm.org/route/v1/driving/" +
      `${originLongitude},${originLatitude};` +
      `${destinationLongitude},${destinationLatitude}` +
      "?overview=false&alternatives=false&steps=false";

    const routeResponse = await fetch(routeUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "CommerceOS/0.1 delivery-quote",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!routeResponse.ok) {
      throw new Error("Não foi possível calcular a rota.");
    }

    const routeData = (await routeResponse.json()) as RouteResponse;
    const route = routeData.routes?.[0];

    if (routeData.code !== "Ok" || !route?.distance) {
      throw new Error("Não foi encontrada uma rota para este CEP.");
    }

    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const fee = calculateDeliveryFee(
      distanceKm,
      tenant.operation.deliveryPricing.bands,
    );

    if (
      fee === null ||
      distanceKm > tenant.operation.deliveryPricing.maxDistanceKm
    ) {
      return Response.json(
        {
          error:
            "O endereço está fora da faixa automática. Fale com a equipe para uma cotação manual.",
          distanceKm,
          manualQuote: true,
        },
        { status: 422 },
      );
    }

    return Response.json({
      cep: destination.cep,
      city: destination.city,
      state: destination.state,
      neighborhood: destination.neighborhood ?? "",
      street: destination.street ?? "",
      distanceKm,
      durationMinutes: route.duration
        ? Math.max(1, Math.round(route.duration / 60))
        : null,
      fee,
      estimated: true,
      disclaimer: tenant.operation.deliveryPricing.disclaimer,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível calcular a entrega.";

    return Response.json({ error: message }, { status: 500 });
  }
}
