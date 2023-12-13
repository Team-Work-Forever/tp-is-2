-- Create Region with Geometry information

CREATE OR REPLACE FUNCTION create_region_fun
(
    _name text,
    _province text,
    _lat numeric,
    _lon numeric,
    _country_id uuid
)
    RETURNS SETOF region
AS $$
DECLARE 
    _geom geometry;
    _region_id uuid;
BEGIN
    SELECT ST_SetSRID(ST_MakePoint(_lat, _lon), 4326) INTO _geom;

    INSERT INTO region(name, province, coordinates, country_id)
    VALUES (_name, _province, _geom, _country_id)
    RETURNING id INTO _region_id;
    
    RETURN QUERY SELECT * FROM region where id = _region_id;
END;
$$ LANGUAGE plpgsql;