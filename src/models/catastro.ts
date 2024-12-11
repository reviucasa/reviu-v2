import proj4 from "proj4";

class NumerosPosibles {
  referenciaCatastral: ReferenciaCatastral;
  numero: number;

  constructor(referenciaCatastral: ReferenciaCatastral, numero: number) {
    this.referenciaCatastral = referenciaCatastral;
    this.numero = numero;
  }
}

class Error {
  code: string;
  desc: string;

  constructor(code: string, desc: string) {
    this.code = code;
    this.desc = desc;
  }
}

class Direccion {
  cv: string;
  siglas: string;
  nombre: string;
  numero: string;
  snp?: string;

  constructor(
    cv: string,
    siglas: string,
    nombre: string,
    numero: string,
    snp?: string
  ) {
    this.cv = cv;
    this.siglas = siglas;
    this.nombre = nombre;
    this.numero = numero;
    this.snp = snp;
  }
}

export type Unidad = {
  id?: string;
  stair?: string;
  floor?: string;
  door?: string;

  /* constructor(id: string, planta: string, escalera?: string, puerta?: string) {
    this.id = id;
    this.floor = planta;
    this.stair = escalera ?? "";
    this.door = puerta;
  } */
};

class Ubicacion {
  direccion: Direccion;
  unidad: Unidad;
  codigoPostal: string;
  descripcionMunicipal?: string;

  constructor(
    direccion: Direccion,
    unidad: Unidad,
    codigoPostal: string,
    descripcionMunicipal?: string
  ) {
    this.direccion = direccion;
    this.unidad = unidad;
    this.codigoPostal = codigoPostal;
    this.descripcionMunicipal = descripcionMunicipal;
  }
}

class CodigoLocalizacion {
  codigoProvincia: string;
  codigoMunicipio: string;

  constructor(codigoProvincia: string, codigoMunicipio: string) {
    this.codigoProvincia = codigoProvincia;
    this.codigoMunicipio = codigoMunicipio;
  }
}

class Localizacion {
  codigoLocalizacion: CodigoLocalizacion;
  cmc: string;
  provincia: string;
  municipio: string;
  ubicacion: Ubicacion;

  constructor(
    codigoLocalizacion: CodigoLocalizacion,
    cmc: string,
    provincia: string,
    municipio: string,
    ubicacion: Ubicacion
  ) {
    this.codigoLocalizacion = codigoLocalizacion;
    this.cmc = cmc;
    this.provincia = provincia;
    this.municipio = municipio;
    this.ubicacion = ubicacion;
  }
}

class DescripcionBienInmueble {
  uso: string;
  superficie: string;
  participacionInmueble: string;
  anoConstruccion: string;

  constructor(
    uso: string,
    superficie: string,
    participacionInmueble: string,
    anoConstruccion: string
  ) {
    this.uso = uso;
    this.superficie = superficie;
    this.participacionInmueble = participacionInmueble;
    this.anoConstruccion = anoConstruccion;
  }
}

class ReferenciaCatastral {
  unidad: string;
  edificio: string;

  constructor(pc1: string, pc2: string, car: string, cc1: string, cc2: string) {
    this.unidad = `${pc1}${pc2}${car}${cc1}${cc2}`;
    this.edificio = `${pc1}${pc2}`;
  }
}

class RegistroCatastral {
  referenciaCatastral: ReferenciaCatastral; // rc
  localizacion: Localizacion; // dt
  descripcionBienInmueble: DescripcionBienInmueble; // debi

  constructor(
    referenciaCatastral: ReferenciaCatastral,
    localizacion: Localizacion,
    descripcionBienInmueble: DescripcionBienInmueble
  ) {
    this.referenciaCatastral = referenciaCatastral;
    this.localizacion = localizacion;
    this.descripcionBienInmueble = descripcionBienInmueble;
  }
}

class ListaRegistroCatastral {
  registros: RegistroCatastral[];

  constructor(registros: RegistroCatastral[]) {
    this.registros = registros;
  }
}

class Construccion {
  descripcionUso: string; // lcd
  detallesUbicacion: {
    localizacionUrbana: {
      unidad: Unidad;
    };
  };
  detallesConstruccion: {
    superficieTotal?: string; // stl
  };
  detallesVivienda: {
    tipoVivienda?: string; // dtip
  };

  constructor(
    descripcionUso: string,
    planta?: string,
    superficieTotal?: string,
    tipoVivienda?: string,
    puerta?: string,
    escalera?: string
  ) {
    this.descripcionUso = descripcionUso;
    this.detallesUbicacion = {
      localizacionUrbana: {
        unidad: {
          floor: planta,
          door: puerta,
          stair: escalera,
        },
      },
    };
    this.detallesConstruccion = {
      superficieTotal: superficieTotal,
    };
    this.detallesVivienda = {
      tipoVivienda: tipoVivienda,
    };
  }
}

class Bico {
  identificacionBienInmueble: {
    claseBien: string; // cn
    referenciaCatastral: ReferenciaCatastral; // rc
  };
  localizacion: Localizacion; // dt
  descripcionTexto: string; // ldt
  descripcionBienInmueble: DescripcionBienInmueble; // debi
  listaConstrucciones: Construccion[]; // lcons

  constructor(
    identificacionBienInmueble: {
      claseBien: string;
      referenciaCatastral: ReferenciaCatastral;
    },
    localizacion: Localizacion,
    descripcionTexto: string,
    descripcionBienInmueble: DescripcionBienInmueble,
    listaConstrucciones: Construccion[]
  ) {
    this.identificacionBienInmueble = identificacionBienInmueble;
    this.localizacion = localizacion;
    this.descripcionTexto = descripcionTexto;
    this.descripcionBienInmueble = descripcionBienInmueble;
    this.listaConstrucciones = listaConstrucciones;
  }
}

class Response {
  listaRegistroCatastral?: ListaRegistroCatastral;
  bico?: Bico;
  numerero?: NumerosPosibles[];
  errores?: Error[];

  constructor(
    listaRegistroCatastral?: ListaRegistroCatastral,
    bico?: Bico,
    numerero?: NumerosPosibles[],
    errores?: Error[]
  ) {
    this.listaRegistroCatastral = listaRegistroCatastral;
    this.bico = bico;
    this.numerero = numerero;
    this.errores = errores;
  }
}

export class CatastroResponse {
  response: Response;

  constructor(response: Response) {
    this.response = response;
  }

  static fromJson(json: any): CatastroResponse {
    let listaRegistroCatastral;

    const result = json.consulta_dnplocResult ?? json.consulta_dnprcResult;
    console.log(result);
    if (result.lrcdnp) {
      listaRegistroCatastral = new ListaRegistroCatastral(
        result.lrcdnp.rcdnp.map(
          (rcdnp: any) =>
            new RegistroCatastral(
              new ReferenciaCatastral(
                rcdnp.rc.pc1,
                rcdnp.rc.pc2,
                rcdnp.rc.car,
                rcdnp.rc.cc1,
                rcdnp.rc.cc2
              ),
              new Localizacion(
                new CodigoLocalizacion(rcdnp.dt.loine.cp, rcdnp.dt.loine.cm),
                rcdnp.dt.cmc,
                rcdnp.dt.np,
                rcdnp.dt.nm,
                new Ubicacion(
                  new Direccion(
                    rcdnp.dt.locs.lous.lourb.dir.cv,
                    rcdnp.dt.locs.lous.lourb.dir.tv,
                    rcdnp.dt.locs.lous.lourb.dir.nv,
                    rcdnp.dt.locs.lous.lourb.dir.pnp,
                    rcdnp.dt.locs.lous.lourb.dir.snp
                  ),
                  {
                    id: rcdnp.rc.car + rcdnp.rc.cc1 + rcdnp.rc.cc2,
                    floor: rcdnp.dt.locs.lous.lourb.loint.pt,
                    stair: rcdnp.dt.locs.lous.lourb.loint.es,
                    door: rcdnp.dt.locs.lous.lourb.loint.pu,
                  } as Unidad,
                  rcdnp.dt.locs.lous.lourb.dp,
                  rcdnp.dt.locs.lous.lourb.dm
                )
              ),
              new DescripcionBienInmueble(
                rcdnp.debi.luso,
                rcdnp.debi.sfc,
                rcdnp.debi.cpt,
                rcdnp.debi.ant
              )
            )
        )
      );
    }

    let bico;
    if (result.bico) {
      const idbi = {
        claseBien: result.bico.bi.idbi.cn,
        referenciaCatastral: new ReferenciaCatastral(
          result.bico.bi.idbi.rc.pc1,
          result.bico.bi.idbi.rc.pc2,
          result.bico.bi.idbi.rc.car,
          result.bico.bi.idbi.rc.cc1,
          result.bico.bi.idbi.rc.cc2
        ),
      };

      const dt = new Localizacion(
        new CodigoLocalizacion(
          result.bico.bi.dt.loine.cp,
          result.bico.bi.dt.loine.cm
        ),
        result.bico.bi.dt.cmc,
        result.bico.bi.dt.np,
        result.bico.bi.dt.nm,
        new Ubicacion(
          new Direccion(
            result.bico.bi.dt.locs.lous.lourb.dir.cv,
            result.bico.bi.dt.locs.lous.lourb.dir.tv,
            result.bico.bi.dt.locs.lous.lourb.dir.nv,
            result.bico.bi.dt.locs.lous.lourb.dir.pnp
          ),
          {
            id:
              result.bico.bi.dt.locs.lous.lourb.loint.es +
              result.bico.bi.dt.locs.lous.lourb.loint.pt +
              result.bico.bi.dt.locs.lous.lourb.loint.pu,
            floor: result.bico.bi.dt.locs.lous.lourb.loint.pt,
            stair: result.bico.bi.dt.locs.lous.lourb.loint.es,
            door: result.bico.bi.dt.locs.lous.lourb.loint.pu,
          } as Unidad,
          result.bico.bi.dt.locs.lous.lourb.dp
        )
      );

      const debi = new DescripcionBienInmueble(
        result.bico.bi.debi.luso,
        result.bico.bi.debi.sfc,
        result.bico.bi.debi.cpt,
        result.bico.bi.debi.ant
      );

      const lcons = result.bico.lcons.map(
        (lcon: any) =>
          new Construccion(
            lcon.lcd,
            lcon.dt?.lourb.loint.pt,
            lcon.dfcons.stl,
            lcon.dvcons?.dtip,
            lcon.dt?.lourb.loint.pu
          )
      );

      bico = new Bico(idbi, dt, result.bico.bi.ldt, debi, lcons);
    }

    let numerero: NumerosPosibles[] = [];
    if (result.numerero) {
      numerero = result.numerero.nump.map((num: any) => {
        return new NumerosPosibles(
          new ReferenciaCatastral(num.pc.pc1, num.pc.pc2, "", "", ""),
          num.num.pnp
        );
        /*  return {
          pc1: num.pc.pc1,
          pc2: num.pc.pc2,
          pnp: num.num.pnp,
        }; */
      });
    }

    let errores: Error[] = [];
    if (result.lerr) {
      errores = result.lerr.map(
        (error: any) => new Error(error.cod, error.des)
      );
    }

    const response = new Response(
      listaRegistroCatastral,
      bico,
      numerero,
      errores
    );

    return new CatastroResponse(response);
  }
}

interface Coordinate {
  latitude: number;
  longitude: number;
  srs: string;
}

interface Coordinates {
  coordinates: Coordinate[];
}

export class CoordinatesResponse {
  coordinates: Coordinate[];

  constructor(coordinates: Coordinate[]) {
    this.coordinates = coordinates;
  }

  static fromJson(json: any): Coordinates {
    // Define the projection for EPSG:25831
    const epsg25831 = "+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs";
    const wgs84 = proj4.WGS84;

    const coordinates: Coordinate[] =
      json.Consulta_CPMRCResult.coordenadas.coord.map((coord: any) => {
        const [longitude, latitude] = proj4(epsg25831, wgs84, [
          parseFloat(coord.geo.xcen),
          parseFloat(coord.geo.ycen),
        ]);
        return {
          latitude: latitude,
          longitude: longitude,
          srs: coord.geo.srs,
        };
      });

    return new CoordinatesResponse(coordinates);
  }
}
