/*
  # Fix Row Level Security Policies

  1. Security Updates
    - Drop existing policies that might be causing issues
    - Create comprehensive RLS policies for all tables
    - Ensure authenticated users can perform all CRUD operations
    - Add proper policies for each table (brands, models, spare_parts, repair_requests, repair_parts, workshop_settings)

  2. Policy Details
    - All tables will have policies allowing full access to authenticated users
    - Policies are designed to be permissive for authenticated users while maintaining security
    - Each table gets separate policies for SELECT, INSERT, UPDATE, and DELETE operations
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON brands;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON models;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON spare_parts;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON repair_requests;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON repair_parts;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON workshop_settings;

-- Brands table policies
CREATE POLICY "Authenticated users can select brands"
  ON brands
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert brands"
  ON brands
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update brands"
  ON brands
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete brands"
  ON brands
  FOR DELETE
  TO authenticated
  USING (true);

-- Models table policies
CREATE POLICY "Authenticated users can select models"
  ON models
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert models"
  ON models
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update models"
  ON models
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete models"
  ON models
  FOR DELETE
  TO authenticated
  USING (true);

-- Spare parts table policies
CREATE POLICY "Authenticated users can select spare_parts"
  ON spare_parts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert spare_parts"
  ON spare_parts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update spare_parts"
  ON spare_parts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete spare_parts"
  ON spare_parts
  FOR DELETE
  TO authenticated
  USING (true);

-- Repair requests table policies
CREATE POLICY "Authenticated users can select repair_requests"
  ON repair_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert repair_requests"
  ON repair_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update repair_requests"
  ON repair_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete repair_requests"
  ON repair_requests
  FOR DELETE
  TO authenticated
  USING (true);

-- Repair parts table policies
CREATE POLICY "Authenticated users can select repair_parts"
  ON repair_parts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert repair_parts"
  ON repair_parts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update repair_parts"
  ON repair_parts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete repair_parts"
  ON repair_parts
  FOR DELETE
  TO authenticated
  USING (true);

-- Workshop settings table policies
CREATE POLICY "Authenticated users can select workshop_settings"
  ON workshop_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert workshop_settings"
  ON workshop_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update workshop_settings"
  ON workshop_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete workshop_settings"
  ON workshop_settings
  FOR DELETE
  TO authenticated
  USING (true);